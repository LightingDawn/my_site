const db = require("../data/database");
const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

class User {
  constructor(username, nickname, email, confirmEmail, password) {
    this.username = username;
    this.nickname = nickname;
    this.email = email;
    this.confirmEmail = confirmEmail;
    this.password = password;
  }

  static async findUser(userId) {
    const objectId = new mongodb.ObjectId(userId);
    try {
      const user = await db
        .getDb()
        .collection("users")
        .findOne({ _id: objectId }, { projection: { password: 0 } });
      return user;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async save() {
    try {
      const hashPassword = await bcrypt.hash(this.password, 12);
      await db.getDb().collection("users").insertOne({
        username: this.username,
        nickname: this.nickname,
        email: this.email,
        password: hashPassword,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async userAlreadyExist() {
    try {
      const user = await db
        .getDb()
        .collection("users")
        .findOne({ email: this.email });
      return user;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async nicknameAlreadyUse() {
    try {
      const user = await db.getDb().collection("users").findOne({
        nickname: this.nickname,
      });
      return user;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async comparePassword(storedData) {
    const comparePassword = await bcrypt.compare(this.password, storedData);
    return comparePassword;
  }
}

module.exports = User;
