const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5001/api"
  : "https://kanji.fishiden.com/api";

const getHeaders = () => {
  const token = localStorage.getItem("kanjigraph_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || (response.status === 404 && data.error === "User tidak ditemukan")) {
      localStorage.removeItem("kanjigraph_token");
      localStorage.removeItem("kanjigraph_role");
      window.location.hash = "/login";
    }
    throw new Error(data.error || "Terjadi kesalahan koneksi ke server.");
  }
  return data;
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      console.log(data)
      if (data.token) {
        localStorage.setItem("kanjigraph_token", data.token);
        localStorage.setItem("kanjigraph_role", data.user.role || "USER");
      }
      return data;
    },
    register: async (email: string, password: string, name: string) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem("kanjigraph_token", data.token);
        localStorage.setItem("kanjigraph_role", data.user.role || "USER");
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem("kanjigraph_token");
      localStorage.removeItem("kanjigraph_role");
    },
    isAuthenticated: () => {
      return !!localStorage.getItem("kanjigraph_token");
    },
    getRole: () => {
      return localStorage.getItem("kanjigraph_role") || "USER";
    }
  },
  dashboard: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },
  modules: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/modules`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },
  latihan: {
    get: async (character: string) => {
      const res = await fetch(`${BASE_URL}/latihan/${encodeURIComponent(character)}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    verify: async (character: string, accuracy?: number) => {
      const res = await fetch(`${BASE_URL}/latihan/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ character, accuracy }),
      });
      return handleResponse(res);
    }
  },
  progress: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/progress`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },
  profile: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await handleResponse(res);
      if (data && data.role) {
        localStorage.setItem("kanjigraph_role", data.role);
      }
      return data;
    },
    update: async (data: any) => {
      const isFormData = data instanceof FormData;
      const token = localStorage.getItem("kanjigraph_token");
      const headers = isFormData 
        ? { ...(token ? { "Authorization": `Bearer ${token}` } : {}) } 
        : getHeaders();

      const res = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });
      return handleResponse(res);
    }
  },
  admin: {
    modules: {
      list: async () => {
        const res = await fetch(`${BASE_URL}/admin/modules`, {
          method: "GET",
          headers: getHeaders(),
        });
        return handleResponse(res);
      },
      create: async (title: string, tujuanPembelajaran?: string) => {
        const res = await fetch(`${BASE_URL}/admin/modules`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ title, tujuanPembelajaran }),
        });
        return handleResponse(res);
      },
      update: async (id: number, title: string, tujuanPembelajaran?: string) => {
        const res = await fetch(`${BASE_URL}/admin/modules/${id}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ title, tujuanPembelajaran }),
        });
        return handleResponse(res);
      },
      delete: async (id: number) => {
        const res = await fetch(`${BASE_URL}/admin/modules/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        return handleResponse(res);
      }
    },
    kanjis: {
      list: async () => {
        const res = await fetch(`${BASE_URL}/admin/kanjis`, {
          method: "GET",
          headers: getHeaders(),
        });
        return handleResponse(res);
      },
      create: async (data: any) => {
        const res = await fetch(`${BASE_URL}/admin/kanjis`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        return handleResponse(res);
      },
      update: async (id: number, data: any) => {
        const res = await fetch(`${BASE_URL}/admin/kanjis/${id}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        return handleResponse(res);
      },
      delete: async (id: number) => {
        const res = await fetch(`${BASE_URL}/admin/kanjis/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        return handleResponse(res);
      }
    }
  }
};
