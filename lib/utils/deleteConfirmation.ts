const DELETE_PASSWORD = "0000";

export const confirmDelete = async (message: string = "本当に削除しますか？"): Promise<boolean> => {
  const password = prompt("削除用パスワードを入力してください:");
  if (password !== DELETE_PASSWORD) {
    alert("パスワードが正しくありません。");
    return false;
  }

  return confirm(message);
}; 