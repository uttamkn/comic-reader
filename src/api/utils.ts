import axios from "axios";

export const getToken = (): string => {
  const tokenString = localStorage.getItem("token");
  let token: string | null = null;
  if (tokenString) {
    try {
      token = JSON.parse(tokenString);
    } catch (error) {
      console.error("Failed to parse token:", error);
      token = null;
    }
  }

  return token || "";
};

export const putCurrentPage = async (
  userId: number,
  comicId: number,
  currentPage: number
): Promise<void> => {
  try {
    await axios.put(
      `/log_progress`,
      { user_id: userId, book_id: comicId, page_num: currentPage },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  } catch (error) {
    console.error("Error updating current page:", error);
  }
};

export const getCurrentPage = async (
  user_id: number,
  comic_id: number
): Promise<number> => {
  let currentPage = 0;

  try {
    const response = await axios.get(`/log_progress/user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    response.data.readingprogress.map((progress: any) => {
      if (progress.bookrepo_id === comic_id && progress.user_id === user_id) {
        currentPage = progress.page_num;
      }
    });
  } catch (error) {
    console.error("Error fetching current page:", error);
  }

  return currentPage;
};

export const getThumbnailUrl = async (comicId: number): Promise<string> => {
  let url: string = "";

  try {
    const response = await axios.get(`/comics/thumbnails/${comicId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "image/jpeg" });
    url = URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching thumbnail:", error);
  }

  return url;
};
