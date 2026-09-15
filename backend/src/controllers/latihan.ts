import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

// Get detail of a specific kanji (e.g., "情報")
export const getKanjiDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { character } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!character) {
      return res.status(400).json({ error: "Karakter kanji wajib ditentukan." });
    }

    // Find Kanji with parent Module title
    const kanji = await prisma.kanji.findUnique({
      where: { character },
      include: {
        examples: true,
        graphEdges: true,
        module: true,
        jukugos: {
          include: {
            kategoriKanji: {
              include: {
                category: true,
              },
            },
          },
        },
        semanticRelations: {
          include: {
            nodes: true,
            jukugo: true,
          },
        },
        masterRefleksi: true,
        quizzes: {
          orderBy: {
            type: "asc",
          },
        },
      },
    });

    if (!kanji) {
      return res.status(404).json({ error: `Kanji ${character} tidak ditemukan.` });
    }

    // Find User progress for this Kanji
    const progress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const masteryPercent = progress ? progress.masteryPercent : 0;
    const writingPercent = progress ? progress.writingPercent : 0;
    const readingPercent = progress ? progress.readingPercent : 0;
    const quizPercent = progress ? progress.quizPercent : 0;
    
    // Map mastery level to title
    let levelTitle = "Perunggu";
    if (masteryPercent >= 80) levelTitle = "Tingkat Emas";
    else if (masteryPercent >= 50) levelTitle = "Tingkat Perak";

    // Build Graph Nodes & Edges dynamically from Kanji + KategoriKanji + Jukugo
    const { nodes, edges } = await buildDynamicKanjiGraph(kanji.id);

    // Record user activity for accessing this Kanji/Module
    // Only create LESSON activity once per day per kanji to avoid duplicates
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const hasAccessedToday = await prisma.userActivity.findFirst({
      where: {
        userId,
        activityType: "LESSON",
        date: { gte: startOfToday },
        description: { contains: `Kanji ${character}` }
      }
    });

    let xpEarnedAccess = 0;
    if (!hasAccessedToday) {
      // XP awarded only on very first access ever
      const hasAccessedEver = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "LESSON",
          description: { contains: `Kanji ${character}` }
        }
      });
      xpEarnedAccess = hasAccessedEver ? 0 : 5;

      try {
        await prisma.userActivity.create({
          data: {
            userId,
            kanjiCount: 0,
            vocabCount: 1,
            xpEarned: xpEarnedAccess,
            activityType: "LESSON",
            description: `Membuka Modul: Mempelajari tata bahasa & etimologi Kanji ${character}`,
          },
        });
      } catch (actErr) {
        console.warn("Gagal membuat userActivity (user mungkin sudah di-reset):", actErr);
      }
    }

    const claimedActivities = await prisma.userActivity.findMany({
      where: {
        userId,
        date: { gte: startOfToday },
        activityType: "REVIEW"
      }
    });

    const xpClaimed = {
      lesson: true, // opening module theory is always claimed once loaded (either today or previously)
      writing: claimedActivities.some(act => act.description.includes(`menulis Kanji ${character}`)),
      reading: claimedActivities.some(act => act.description.includes(`membaca kalimat Kanji ${character}`)),
      quiz: claimedActivities.some(act => act.description.includes(`kuis latihan Kanji ${character}`))
    };

    const parseJsonDeep = (val: any): any => {
      let result = val;
      while (typeof result === "string") {
        const trimmed = result.trim();
        if (
          (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
          (trimmed.startsWith("{") && trimmed.endsWith("}"))
        ) {
          try {
            result = JSON.parse(result);
          } catch (e) {
            break;
          }
        } else {
          break;
        }
      }
      return result;
    };

    const normalizeGroups = (rawGroups: any): any[] => {
      let data = parseJsonDeep(rawGroups);
      if (!data) return [];

      if (typeof data === "object" && !Array.isArray(data)) {
        return Object.entries(data).map(([catName, words]) => {
          const items = Array.isArray(words)
            ? words
            : typeof words === "string"
              ? [words]
              : [];
          return {
            name: catName,
            category: catName,
            correctWords: items,
            items: items,
          };
        });
      }

      if (Array.isArray(data)) {
        const result: any[] = [];
        for (const g of data) {
          if (typeof g === "string") {
            result.push({ name: g, category: g, correctWords: [], items: [] });
          } else if (typeof g === "object" && g !== null) {
            if (g.name === undefined && g.category === undefined) {
              const entries = Object.entries(g);
              if (entries.length > 0) {
                for (const [catName, words] of entries) {
                  const items = Array.isArray(words)
                    ? words
                    : typeof words === "string"
                      ? [words]
                      : [];
                  result.push({
                    name: catName,
                    category: catName,
                    correctWords: items,
                    items: items,
                  });
                }
                continue;
              }
            }

            const catName = g.name || g.category || g.title || g.label || "";
            const words = Array.isArray(g.correctWords)
              ? g.correctWords
              : Array.isArray(g.items)
                ? g.items
                : Array.isArray(g.words)
                  ? g.words
                  : [];
            result.push({
              name: catName,
              category: catName,
              correctWords: words,
              items: words,
            });
          }
        }
        return result;
      }

      return [];
    };

    const formattedQuizzes = kanji.quizzes.map((q) => {
      const parsedOptions = parseJsonDeep(q.options);
      const parsedCorrectAnswer = parseJsonDeep(q.correctAnswer);
      const parsedGroups = normalizeGroups(q.groups);

      return {
        id: q.id,
        type: q.type || "multiple",
        question: q.question || "",
        options: Array.isArray(parsedOptions)
          ? parsedOptions
          : parsedOptions
            ? [parsedOptions]
            : [],
        correctAnswer: parsedCorrectAnswer,
        words: parseJsonDeep(q.words),
        correctOrder: parseJsonDeep(q.correctOrder),
        targetWord: q.targetWord || "",
        leftItems: parseJsonDeep(q.leftItems),
        rightItems: parseJsonDeep(q.rightItems),
        pairs: parseJsonDeep(q.pairs),
        groups: parsedGroups,
        explanation: q.explanation || "",
      };
    });

    const QUIZ_TYPE_ORDER: Record<string, number> = {
      unscramble: 1,
      grouping: 2,
      multiple: 3,
      fill: 4,
      essay: 5,
      matching: 6,
    };

    formattedQuizzes.sort((a, b) => {
      const orderA = QUIZ_TYPE_ORDER[a.type] || 99;
      const orderB = QUIZ_TYPE_ORDER[b.type] || 99;
      return orderA - orderB;
    });

    res.json({
      id: kanji.id,
      kanji: kanji.character,
      character: kanji.character,
      romaji: kanji.romaji,
      meaning: kanji.meaning,
      bushuu: kanji?.bushuu || "-",
      onyomi: kanji?.onyomi || "-",
      kunyomi: kanji.kunyomi || "-",
      baseMeaning: kanji?.baseMeaning || "",
      border: kanji.border || null,
      moduleId: kanji.moduleId || null,
      moduleTitle: kanji.module ? kanji.module.title : null,
      masteryPercent,
      writingPercent,
      readingPercent,
      quizPercent,
      masteryLevelTitle: levelTitle,
      quizData: JSON.stringify(formattedQuizzes),
      quizzes: formattedQuizzes,
      xpEarned: xpEarnedAccess,
      xpClaimed,
      examples: kanji.examples.map((ex) => ({
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation,
        isReading: ex.isReading !== undefined ? ex.isReading : true,
      })),
      jukugos: kanji.jukugos.map((j) => ({
        id: j.id,
        word: j.word,
        reading: j.reading,
        meaning: j.meaning,
        category: (j as any).kategoriKanji?.[0]?.category?.name || "",
      })),
      graph: {
        nodes,
        edges,
      },
      masterRefleksi: kanji.masterRefleksi.map((mr) => ({
        id: mr.id,
        question: mr.question,
      })),
      refleksiData: await prisma.refleksiData.findMany({
        where: { userId, kanjiId: kanji.id },
      }),
      semanticRelations: kanji.semanticRelations.map((sr) => ({
        id: sr.id,
        kanji: sr.jukugo?.word || "",
        arti: sr.jukugo?.meaning || "",
        penjelasan: sr.penjelasan || "",
        nodes: sr.nodes.map((n) => ({
          jokugo: n.jokugo,
          arti: n.arti,
        })),
      })),
      researchDetails: await (async () => {
        const allKanji = await prisma.kanji.findMany();
        const kanjiMap: Record<string, any> = {};
        allKanji.forEach(k => {
          kanjiMap[k.character] = k;
        });

        const otherJukugos = await prisma.jukugo.findMany({
          where: { kanjiId: { not: kanji.id } },
          include: {
            kategoriKanji: {
              include: { category: true }
            },
            semanticRelations: {
              include: { nodes: true }
            }
          }
        });

        const currentJukugos = await prisma.jukugo.findMany({
          where: { kanjiId: kanji.id },
          include: {
            kategoriKanji: {
              include: { category: true }
            },
            semanticRelations: {
              include: { nodes: true }
            }
          }
        });

        const resObj: Record<string, { explanation: string; charRoles: Record<string, string>; category: string }> = {};
        
        const processJk = (jk: typeof otherJukugos[0]) => {
          const charRoles: Record<string, string> = {};
          for (const char of jk.word) {
            if (kanjiMap[char]) {
              charRoles[char] = kanjiMap[char].meaning;
            }
          }
          if (jk.semanticRelations && jk.semanticRelations.length > 0) {
            for (const sr of jk.semanticRelations) {
              if (sr.nodes) {
                for (const n of sr.nodes) {
                  charRoles[n.jokugo.trim()] = n.arti;
                }
              }
            }
          }
          const catName = jk.kategoriKanji[0]?.category?.name || "Kombinasi Utama";
          resObj[jk.word] = {
            explanation: jk.meaning || "",
            charRoles,
            category: catName
          };
        };

        otherJukugos.forEach(processJk);
        currentJukugos.forEach(processJk); // Current kanji strictly overrides and takes precedence!
        return resObj;
      })(),
      constituentKanjiData: await (async () => {
        const allKanji = await prisma.kanji.findMany();
        const resObj: Record<string, any> = {};
        allKanji.forEach(k => {
          resObj[k.character] = {
            romaji: k.romaji || "-",
            meaning: k.meaning || "-",
            baseMeaning: k.baseMeaning || k.meaning || "-",
            bushu: k.bushuu || "-",
            kunyomi: k.kunyomi || "-",
            onyomi: k.onyomi || "-",
            category: "Kanji"
          };
        });
        return resObj;
      })(),
      crossLinkTriples: await (async () => {
        const edges = await prisma.kanjiGraphEdge.findMany({
          where: {
            kanjiId: kanji.id,
            predicate: {
              notIn: ["kategori", "mencakup"]
            }
          }
        });
        const set = new Set<string>();
        const triples: [string, string, string][] = [];
        edges.forEach(e => {
          if (e.predicate) {
            const key = `${e.source}|${e.predicate}|${e.target}`;
            if (!set.has(key)) {
              set.add(key);
              triples.push([e.source, e.predicate, e.target]);
            }
          }
        });
        return triples;
      })(),
      breakdownTrees: await (async () => {
        const allKanji = await prisma.kanji.findMany({
          include: { module: true }
        });
        const kanjiMap = new Map<string, any>();
        allKanji.forEach(k => {
          kanjiMap.set(k.character, {
            character: k.character,
            romaji: k.romaji || "-",
            meaning: k.meaning || "-",
            baseMeaning: k.baseMeaning || k.meaning || "-",
            bushu: k.bushuu || "-",
            kunyomi: k.kunyomi || "-",
            onyomi: k.onyomi || "-",
            category: k.module?.title || "Kanji"
          });
        });

        const allJukugos = await prisma.jukugo.findMany();
        const jukugoMap = new Map<string, { word: string; reading: string; meaning: string }>();
        allJukugos.filter(j => j.kanjiId !== kanji.id).forEach(j => {
          jukugoMap.set(j.word.trim(), { word: j.word.trim(), reading: j.reading, meaning: j.meaning });
        });
        allJukugos.filter(j => j.kanjiId === kanji.id).forEach(j => {
          jukugoMap.set(j.word.trim(), { word: j.word.trim(), reading: j.reading, meaning: j.meaning });
        });

        const allSemanticRelations = await prisma.semanticRelation.findMany({
          include: {
            nodes: true,
            jukugo: true
          }
        });
        const semMap = new Map<string, any>();
        allSemanticRelations.filter(s => s.kanjiId !== kanji.id).forEach(s => {
          if (s.jukugo?.word) {
            semMap.set(s.jukugo.word.trim(), s);
          }
        });
        allSemanticRelations.filter(s => s.kanjiId === kanji.id).forEach(s => {
          if (s.jukugo?.word) {
            semMap.set(s.jukugo.word.trim(), s);
          }
        });

        const SUB_JUKUGO_READING_MAP: Record<string, string> = {
          "調味": "ちょうみ",
          "原因": "げんいん",
          "究明": "きゅうめい",
          "真相": "しんそう",
          "本質": "ほんしつ",
          "結論": "けつろん",
          "事実": "じじつ",
          "問題": "もんだい",
          "学術": "がくじゅつ",
          "市場": "しじょう",
          "統計": "とうけい",
          "現地": "げんち",
          "報告": "ほうこく",
          "報告書": "ほうこくしょ",
          "旅行": "りょこう",
          "制度": "せいど",
          "方法": "ほうほう",
          "分野": "ぶんや"
        };

        const isHiragana = (ch: string) => /^[\u3040-\u309F]$/.test(ch);

        const getRoleOrMeaning = (c: string) => {
          if (isHiragana(c)) return `Okurigana (${c})`;
          const k = kanjiMap.get(c);
          if (k && k.meaning && k.meaning !== "-") return k.meaning;
          if (k && k.baseMeaning && k.baseMeaning !== "-") return k.baseMeaning;
          return `Kanji ${c}`;
        };

        const getSubObj = (w: string) => {
          const j = jukugoMap.get(w);
          const meaning = j?.meaning || w;
          const reading = j?.reading || SUB_JUKUGO_READING_MAP[w] || "";
          const nestedKanjis = Array.from(w).map(c => {
            const k = kanjiMap.get(c);
            if (k) return k;
            return {
              character: c,
              romaji: "-",
              meaning: getRoleOrMeaning(c),
              baseMeaning: "-",
              bushu: "-",
              kunyomi: "-",
              onyomi: "-",
              category: isHiragana(c) ? "Hiragana" : "Kanji"
            };
          });

          return {
            word: w,
            reading,
            meaning,
            nestedKanjis
          };
        };

        const trees: Record<string, any> = {};
        const uniqueWords = Array.from(new Set(allJukugos.map(j => j.word.trim())));

        for (const word of uniqueWords) {
          const dbJukugo = jukugoMap.get(word);
          const wordMeaning = dbJukugo?.meaning || word;
          const wordReading = dbJukugo?.reading || "";

          // Priority 0: Explicit DB SemanticRelation with Nodes
          const semRel = semMap.get(word);
          if (semRel && semRel.nodes && semRel.nodes.length >= 2) {
            const explanationItems: any[] = [];
            const formulaElements: any[] = [];
            const breakdownItems: any[] = [];

            for (const n of semRel.nodes) {
              const nodeWord = n.jokugo.trim();
              const nodeArti = n.arti;

              explanationItems.push({ word: nodeWord, meaning: nodeArti });

              if (nodeWord.length >= 2) {
                const subObj = getSubObj(nodeWord);
                formulaElements.push({
                  word: nodeWord,
                  reading: subObj.reading || "",
                  meaning: nodeArti
                });
                breakdownItems.push({
                  type: "SUB_JUKUGO",
                  word: nodeWord,
                  reading: subObj.reading || "",
                  meaning: nodeArti,
                  nestedKanjis: subObj.nestedKanjis
                });
              } else {
                const kCard = getSubObj(nodeWord).nestedKanjis[0];
                formulaElements.push({
                  word: nodeWord,
                  reading: kCard.romaji !== "-" ? kCard.romaji : "",
                  meaning: nodeArti
                });
                breakdownItems.push({
                  type: "KANJI",
                  word: nodeWord,
                  meaning: nodeArti,
                  kanjiDetail: kCard
                });
              }
            }

            const allSub = semRel.nodes.every((n: any) => n.jokugo.trim().length >= 2);
            const breakdownType = allSub
              ? "DUAL_SUB_JUKUGO"
              : (word.length === 2 ? "STANDARD_2KANJI" : "ROOT_KANJI_COMPOUND");

            trees[word] = {
              word,
              reading: wordReading,
              meaning: wordMeaning,
              breakdownType,
              explanationItems,
              relationshipExplanation: semRel.penjelasan || `Hubungan makna antar unsur menjadi ${word}, membentuk makna "${wordMeaning}".`,
              formulaElements,
              breakdownItems
            };
            continue;
          }

          // 1. DUAL_SUB_JUKUGO: Any compound word where both split halves exist in DB Jukugo table
          let sub1Obj: any = null;
          let sub2Obj: any = null;

          for (let splitIdx = 1; splitIdx < word.length; splitIdx++) {
            const part1 = word.slice(0, splitIdx);
            const part2 = word.slice(splitIdx);
            if (jukugoMap.has(part1) && jukugoMap.has(part2)) {
              sub1Obj = getSubObj(part1);
              sub2Obj = getSubObj(part2);
              break;
            }
          }

          if (sub1Obj && sub2Obj) {
            trees[word] = {
              word,
              reading: wordReading,
              meaning: wordMeaning,
              breakdownType: "DUAL_SUB_JUKUGO",
              explanationItems: [
                { word: sub1Obj.word, meaning: sub1Obj.meaning },
                { word: sub2Obj.word, meaning: sub2Obj.meaning }
              ],
              relationshipExplanation: `Hubungan makna antara ${sub1Obj.word} (${sub1Obj.meaning}) dan ${sub2Obj.word} (${sub2Obj.meaning}) menjadi ${word}, menunjukkan bahwa gabungan tersebut membentuk makna "${wordMeaning}".`,
              formulaElements: [
                { word: sub1Obj.word, reading: sub1Obj.reading, meaning: sub1Obj.meaning },
                { word: sub2Obj.word, reading: sub2Obj.reading, meaning: sub2Obj.meaning }
              ],
              breakdownItems: [
                { type: "SUB_JUKUGO", word: sub1Obj.word, reading: sub1Obj.reading, meaning: sub1Obj.meaning, nestedKanjis: sub1Obj.nestedKanjis },
                { type: "SUB_JUKUGO", word: sub2Obj.word, reading: sub2Obj.reading, meaning: sub2Obj.meaning, nestedKanjis: sub2Obj.nestedKanjis }
              ]
            };
            continue;
          }

          // 2. ROOT_KANJI_COMPOUND: Words >= 3 kanjis with sub-compounds in DB
          if (word.length >= 3) {
            let headWord = "";
            let tailWord = "";

            const head2 = word.slice(0, 2);
            if (jukugoMap.has(head2)) {
              headWord = head2;
              tailWord = word.slice(2);
            } else {
              const tail2 = word.slice(word.length - 2);
              if (jukugoMap.has(tail2)) {
                headWord = word.slice(0, word.length - 2);
                tailWord = tail2;
              }
            }

            if (headWord) {
              const explanationItems: any[] = [];
              const formulaElements: any[] = [];
              const breakdownItems: any[] = [];

              if (headWord.length === 2) {
                for (const c of Array.from(headWord)) {
                  const kCard = getSubObj(c).nestedKanjis[0];
                  const m = getRoleOrMeaning(c);
                  explanationItems.push({ word: c, meaning: m });
                  formulaElements.push({ word: c, reading: kCard.romaji !== "-" ? kCard.romaji : "", meaning: m });
                  breakdownItems.push({ type: "KANJI", word: c, meaning: m, kanjiDetail: kCard });
                }
              } else {
                const headSub = getSubObj(headWord);
                explanationItems.push({ word: headSub.word, meaning: headSub.meaning });
                formulaElements.push({ word: headSub.word, reading: headSub.reading, meaning: headSub.meaning });
                breakdownItems.push({ type: "SUB_JUKUGO", word: headSub.word, reading: headSub.reading, meaning: headSub.meaning, nestedKanjis: headSub.nestedKanjis });
              }

              if (tailWord.length === 1) {
                const kCard = getSubObj(tailWord).nestedKanjis[0];
                const m = getRoleOrMeaning(tailWord);
                explanationItems.push({ word: tailWord, meaning: m });
                formulaElements.push({ word: tailWord, reading: kCard.romaji !== "-" ? kCard.romaji : "", meaning: m });
                breakdownItems.push({ type: "KANJI", word: tailWord, meaning: m, kanjiDetail: kCard });
              } else if (tailWord.length >= 2) {
                const tailSub = getSubObj(tailWord);
                explanationItems.push({ word: tailSub.word, meaning: tailSub.meaning });
                formulaElements.push({ word: tailSub.word, reading: tailSub.reading, meaning: tailSub.meaning });
                breakdownItems.push({ type: "SUB_JUKUGO", word: tailSub.word, reading: tailSub.reading, meaning: tailSub.meaning, nestedKanjis: tailSub.nestedKanjis });
              }

              trees[word] = {
                word,
                reading: wordReading,
                meaning: wordMeaning,
                breakdownType: "ROOT_KANJI_COMPOUND",
                explanationItems,
                relationshipExplanation: `Hubungan makna antara ${headWord} dan ${tailWord} menjadi ${word}, menunjukkan bahwa gabungan kedua unsur tersebut membentuk makna "${wordMeaning}".`,
                formulaElements,
                breakdownItems
              };
              continue;
            }
          }

          // 3. Fallback: STANDARD_2KANJI or Multi-kanji without sub-compounds in DB (e.g. 学究心)
          const chars = Array.from(word);
          const explanationItems = chars.map(c => ({ word: c, meaning: getRoleOrMeaning(c) }));
          const formulaElements = chars.map(c => {
            const kCard = getSubObj(c).nestedKanjis[0];
            return { word: c, reading: kCard.romaji !== "-" ? kCard.romaji : "", meaning: getRoleOrMeaning(c) };
          });
          const breakdownItems = chars.map(c => ({
            type: "KANJI",
            word: c,
            meaning: getRoleOrMeaning(c),
            kanjiDetail: getSubObj(c).nestedKanjis[0]
          }));

          trees[word] = {
            word,
            reading: wordReading,
            meaning: wordMeaning,
            breakdownType: word.length === 2 ? "STANDARD_2KANJI" : "ROOT_KANJI_COMPOUND",
            explanationItems,
            relationshipExplanation: `Hubungan makna antar kanji ${chars.join(" dan ")} menjadi ${word}, menunjukkan bahwa gabungan unsur tersebut membentuk makna "${wordMeaning}".`,
            formulaElements,
            breakdownItems
          };
        }

        return trees;
      })()
    });
  } catch (error) {
    console.error("Latihan detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat detail latihan." });
  }
};

// Verify handwriting accuracy and save to userkanjiprogress
export const verifyHandwriting = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, accuracy } = req.body;
    
    if (!character) {
      return res.status(400).json({ error: "Karakter target wajib ditentukan." });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const kanji = await prisma.kanji.findUnique({ 
      where: { character },
      include: { module: true }
    });

    if (!kanji) {
      return res.status(404).json({ error: `Kanji ${character} tidak ditemukan.` });
    }

    // Get previous mastery progress to keep the highest score achieved
    const existingProgress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const prevWriting = existingProgress?.writingPercent || 0;
    const prevReading = existingProgress?.readingPercent || 0;
    const prevQuiz = existingProgress?.quizPercent || 0;

    const score = typeof accuracy === "number" ? Math.min(100, Math.max(0, accuracy)) : 100;
    const finalWritingScore = Math.max(prevWriting, score);

    // Calculate weighted average masteryPercent: 40% writing, 30% reading, 30% quiz
    const finalMasteryScore = Math.round(finalWritingScore * 0.4 + prevReading * 0.3 + prevQuiz * 0.3);
    const isMastered = finalMasteryScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        writingPercent: finalWritingScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        writingPercent: finalWritingScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
      },
    });

    // Recalculate associated Module Progress dynamically
    if (kanji.moduleId) {
      const linkedKanjis = await prisma.kanji.findMany({
        where: { moduleId: kanji.moduleId },
        include: {
          userProgress: {
            where: { userId },
          },
        },
      });

      if (linkedKanjis.length > 0) {
        const totalProgress = linkedKanjis.reduce((sum, k) => {
          const mastery = k.userProgress[0]?.masteryPercent || 0;
          return sum + mastery;
        }, 0);
        const averageProgress = Math.round(totalProgress / linkedKanjis.length);

        await prisma.userModuleProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId: kanji.moduleId,
            },
          },
          data: {
            progressPercent: averageProgress,
            isCompleted: averageProgress === 100,
          },
        });
      }
    }

    // Record user activity — award XP once per day per kanji if score >= 60
    let xpEarnedWrite = 0;
    if (score >= 60) {
      const startOfToday2 = new Date();
      startOfToday2.setHours(0, 0, 0, 0);
      const hasEarnedWriteXpToday = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          date: { gte: startOfToday2 },
          xpEarned: { gt: 0 },
          description: { contains: `Kanji ${character}` }
        }
      });
      if (!hasEarnedWriteXpToday) {
        // 15 XP for first pass (>= 75), 10 XP for practice (>= 60)
        xpEarnedWrite = score >= 75 ? 15 : 10;
      }
    }

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 1,
        vocabCount: 0,
        xpEarned: xpEarnedWrite,
        activityType: "REVIEW",
        description: `Melatih Penulisan: Berlatih menulis Kanji ${character} dengan akurasi ${score}%`,
      },
    });

    res.json({
      success: true,
      accuracy: finalMasteryScore,
      detectedText: character,
      xpEarned: xpEarnedWrite,
      message: "Modul Kanji berhasil diselesaikan dan ditandai sebagai Sudah Dipelajari!",
    });
  } catch (error) {
    console.error("Latihan verify error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat melakukan verifikasi goresan." });
  }
};

// Verify reading practice progress
export const verifyReading = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, readingPercent } = req.body;
    
    if (!character) {
      return res.status(400).json({ error: "Karakter target wajib ditentukan." });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const kanji = await prisma.kanji.findUnique({ 
      where: { character },
      include: { module: true }
    });

    if (!kanji) {
      return res.status(404).json({ error: `Kanji ${character} tidak ditemukan.` });
    }

    const existingProgress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const prevWriting = existingProgress?.writingPercent || 0;
    const prevReading = existingProgress?.readingPercent || 0;
    const prevQuiz = existingProgress?.quizPercent || 0;

    const score = typeof readingPercent === "number" ? Math.min(100, Math.max(0, readingPercent)) : 100;
    const finalReadingScore = Math.max(prevReading, score);

    const finalMasteryScore = Math.round(prevWriting * 0.4 + finalReadingScore * 0.3 + prevQuiz * 0.3);
    const isMastered = finalMasteryScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        readingPercent: finalReadingScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        readingPercent: finalReadingScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
      },
    });

    // Recalculate associated Module Progress dynamically
    if (kanji.moduleId) {
      const linkedKanjis = await prisma.kanji.findMany({
        where: { moduleId: kanji.moduleId },
        include: {
          userProgress: {
            where: { userId },
          },
        },
      });

      if (linkedKanjis.length > 0) {
        const totalProgress = linkedKanjis.reduce((sum, k) => {
          const mastery = k.userProgress[0]?.masteryPercent || 0;
          return sum + mastery;
        }, 0);
        const averageProgress = Math.round(totalProgress / linkedKanjis.length);

        await prisma.userModuleProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId: kanji.moduleId,
            },
          },
          data: {
            progressPercent: averageProgress,
            isCompleted: averageProgress === 100,
          },
        });
      }
    }

    // Record activity — award 10 XP only when reading practice is 100% completed, once per day per kanji
    let xpEarnedReading = 0;
    if (score >= 100) {
      const startOfToday2 = new Date();
      startOfToday2.setHours(0, 0, 0, 0);
      const hasEarnedReadingXpToday = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          date: { gte: startOfToday2 },
          xpEarned: { gt: 0 },
          description: { contains: `Membaca Kalimat: Menyelesaikan latihan membaca kalimat Kanji ${character}` }
        }
      });
      if (!hasEarnedReadingXpToday) {
        xpEarnedReading = 10;
      }
    }

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 0,
        vocabCount: 1,
        xpEarned: xpEarnedReading,
        activityType: "REVIEW",
        description: `Membaca Kalimat: Menyelesaikan latihan membaca kalimat Kanji ${character}`,
      },
    });

    res.json({
      success: true,
      accuracy: finalMasteryScore,
      xpEarned: xpEarnedReading,
      message: "Latihan membaca berhasil disimpan!",
    });
  } catch (error) {
    console.error("Latihan verify-reading error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memverifikasi membaca." });
  }
};

// Verify quiz progress
export const verifyQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, quizPercent, modelScores, details } = req.body;
    
    if (!character) {
      return res.status(400).json({ error: "Karakter target wajib ditentukan." });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const kanji = await prisma.kanji.findUnique({ 
      where: { character },
      include: { module: true }
    });

    if (!kanji) {
      return res.status(404).json({ error: `Kanji ${character} tidak ditemukan.` });
    }

    const score = typeof quizPercent === "number" ? Math.min(100, Math.max(0, quizPercent)) : 100;

    const scoreModelA = modelScores?.scoreModelA ?? modelScores?.modelA;
    const rawModelA = modelScores?.rawModelA ?? null;
    const maxModelA = modelScores?.maxModelA ?? null;

    const scoreModelB = modelScores?.scoreModelB ?? modelScores?.modelB;
    const rawModelB = modelScores?.rawModelB ?? null;
    const maxModelB = modelScores?.maxModelB ?? null;

    const scoreModelC = modelScores?.scoreModelC ?? modelScores?.modelC;
    const rawModelC = modelScores?.rawModelC ?? null;
    const maxModelC = modelScores?.maxModelC ?? null;

    const scoreModelD = modelScores?.scoreModelD ?? modelScores?.modelD;
    const rawModelD = modelScores?.rawModelD ?? null;
    const maxModelD = modelScores?.maxModelD ?? null;

    // Determine rubric interpretation according to Section I of penilaian.md
    let interpretation = "Perlu Penguatan";
    if (score >= 86) interpretation = "Sangat Baik";
    else if (score >= 76) interpretation = "Baik";
    else if (score >= 66) interpretation = "Cukup";

    // Attempt counting & best score tracking
    const previousAttempts = await prisma.quizAttempt.findMany({
      where: { userId, kanjiId: kanji.id },
      select: { id: true, totalScore: true },
    });
    const attemptNumber = previousAttempts.length + 1;
    const previousBestScore = previousAttempts.length > 0 
      ? Math.max(...previousAttempts.map((a) => a.totalScore)) 
      : -1;

    const isNewBest = score >= previousBestScore;

    // If new score is the best so far, reset isBestAttempt on older attempts
    if (isNewBest && previousAttempts.length > 0) {
      await prisma.quizAttempt.updateMany({
        where: { userId, kanjiId: kanji.id, isBestAttempt: true },
        data: { isBestAttempt: false },
      });
    }

    // 1. Create QuizAttempt record to store performance per attempt (history always preserved)
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        kanjiId: kanji.id,
        attemptNumber,
        scoreModelA: typeof scoreModelA === "number" ? Math.min(100, Math.max(0, scoreModelA)) : null,
        rawModelA: typeof rawModelA === "number" ? rawModelA : null,
        maxModelA: typeof maxModelA === "number" ? maxModelA : null,
        scoreModelB: typeof scoreModelB === "number" ? Math.min(100, Math.max(0, scoreModelB)) : null,
        rawModelB: typeof rawModelB === "number" ? rawModelB : null,
        maxModelB: typeof maxModelB === "number" ? maxModelB : null,
        scoreModelC: typeof scoreModelC === "number" ? Math.min(100, Math.max(0, scoreModelC)) : null,
        rawModelC: typeof rawModelC === "number" ? rawModelC : null,
        maxModelC: typeof maxModelC === "number" ? maxModelC : null,
        scoreModelD: typeof scoreModelD === "number" ? Math.min(100, Math.max(0, scoreModelD)) : null,
        rawModelD: typeof rawModelD === "number" ? rawModelD : null,
        maxModelD: typeof maxModelD === "number" ? maxModelD : null,
        totalScore: score,
        interpretation,
        isBestAttempt: isNewBest,
        details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : null,
        createdAt: new Date(),
      },
    });

    const existingProgress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const prevWriting = existingProgress?.writingPercent || 0;
    const prevReading = existingProgress?.readingPercent || 0;
    const prevQuiz = existingProgress?.quizPercent || 0;

    // Highest score rule: retain the highest score for student progress and mastery calculation
    const finalQuizScore = Math.max(prevQuiz, score, previousBestScore);

    const finalMasteryScore = Math.round(prevWriting * 0.4 + prevReading * 0.3 + finalQuizScore * 0.3);
    const isMastered = finalMasteryScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        quizPercent: finalQuizScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        quizPercent: finalQuizScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
      },
    });

    // Recalculate associated Module Progress dynamically
    if (kanji.moduleId) {
      const linkedKanjis = await prisma.kanji.findMany({
        where: { moduleId: kanji.moduleId },
        include: {
          userProgress: {
            where: { userId },
          },
        },
      });

      if (linkedKanjis.length > 0) {
        const totalProgress = linkedKanjis.reduce((sum, k) => {
          const mastery = k.userProgress[0]?.masteryPercent || 0;
          return sum + mastery;
        }, 0);
        const averageProgress = Math.round(totalProgress / linkedKanjis.length);

        await prisma.userModuleProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId: kanji.moduleId,
            },
          },
          data: {
            progressPercent: averageProgress,
            isCompleted: averageProgress === 100,
          },
        });
      }
    }

    // Record activity — award XP once per day per kanji if quiz score >= 60%
    let xpEarnedQuiz = 0;
    if (score >= 60) {
      const startOfToday2 = new Date();
      startOfToday2.setHours(0, 0, 0, 0);
      const hasEarnedQuizXpToday = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          date: { gte: startOfToday2 },
          xpEarned: { gt: 0 },
          description: { contains: `Kanji ${character}` }
        }
      });
      if (!hasEarnedQuizXpToday) {
        xpEarnedQuiz = score >= 75 ? 20 : 10;
      }
    }

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 0,
        vocabCount: 1,
        xpEarned: xpEarnedQuiz,
        activityType: "REVIEW",
        description: `Mengerjakan Kuis: Menyelesaikan kuis latihan Kanji ${character} (Percobaan #${attemptNumber}) dengan nilai ${score}%`,
      },
    });

    res.json({
      success: true,
      accuracy: finalMasteryScore,
      xpEarned: xpEarnedQuiz,
      attemptId: quizAttempt.id,
      attemptNumber,
      currentScore: score,
      bestScore: finalQuizScore,
      isNewBest,
      interpretation,
      scoreModelA,
      scoreModelB,
      scoreModelC,
      scoreModelD,
      message: "Hasil kuis berhasil disimpan!",
    });
  } catch (error) {
    console.error("Latihan verify-quiz error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memverifikasi kuis." });
  }
};

// Save User Reflection Answers to RefleksiData table
export const submitRefleksi = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { kanjiId, character, answers } = req.body;
    if (!kanjiId && !character) {
      return res.status(400).json({ error: "Kanji ID atau karakter wajib ditentukan." });
    }

    let targetKanjiId = kanjiId ? parseInt(kanjiId, 10) : null;
    if (!targetKanjiId && character) {
      const k = await prisma.kanji.findUnique({ where: { character } });
      if (k) targetKanjiId = k.id;
    }

    if (!targetKanjiId) {
      return res.status(404).json({ error: "Kanji tidak ditemukan." });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Jawaban refleksi wajib diisi." });
    }

    const savedAnswers = [];
    for (const ans of answers) {
      const masterRefleksiId = ans.masterRefleksiId ? parseInt(ans.masterRefleksiId, 10) : null;
      const question = ans.question ? String(ans.question).trim() : "";
      const answer = ans.answer ? String(ans.answer).trim() : "";

      if (masterRefleksiId) {
        await prisma.refleksiData.deleteMany({
          where: { userId, kanjiId: targetKanjiId, masterRefleksiId },
        });
      } else if (question) {
        await prisma.refleksiData.deleteMany({
          where: { userId, kanjiId: targetKanjiId, question },
        });
      }

      const record = await prisma.refleksiData.create({
        data: {
          userId,
          kanjiId: targetKanjiId,
          masterRefleksiId,
          question,
          answer,
        },
      });
      savedAnswers.push(record);
    }

    res.json({
      success: true,
      message: "Jawaban pertanyaan refleksi berhasil disimpan!",
      refleksiData: savedAnswers,
    });
  } catch (error) {
    console.error("submitRefleksi error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat menyimpan jawaban refleksi." });
  }
};
