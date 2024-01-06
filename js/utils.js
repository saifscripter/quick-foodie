export const getElement = (id) => document.getElementById(id);

export const createButton = (text, className, id) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.id = id;
  return button;
};

export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
