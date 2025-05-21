// api/diary.js
export const saveDiary = async (entry) => {
  // 현재는 localStorage, 나중에 axios.post로 교체 예정
  const list = JSON.parse(localStorage.getItem("diary") || "[]");
  list.push(entry);
  localStorage.setItem("diary", JSON.stringify(list));
};

export const fetchDiary = async () => {
  return JSON.parse(localStorage.getItem("diary") || "[]");
};
