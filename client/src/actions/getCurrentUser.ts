const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user.profile");
    console.log(userData);

    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return null;
  }
};

export default getCurrentUser;
