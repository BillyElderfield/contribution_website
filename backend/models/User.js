const { poolPromise, sql } = require('../db')
const bcrypt = require('bcrypt-nodejs');

class User {

  static generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
  }

  static validPassword(password, hash){
    return bcrypt.compareSync(password, hash);
  }

  static async register(email, username, password){
    let pool = await poolPromise;
    let emailExists = await pool.request()
      .input("email", sql.VarChar(50), email)
      .execute('occurrences_of_email');
    if(emailExists.recordset[0].count > 0){
      return {success: false, error: "Email already in use."};
    }
    let passwordHash = this.generateHash(password);
    let createAccount = await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("email", sql.VarChar(50), email)
      .input("password", sql.VarChar(100), passwordHash)
      .execute("create_user")
    return {success: true}
  }

  static async login(email, password){
    const pool = await poolPromise;
    let userDetails = await pool.request()
      .input("email", sql.VarChar(50), email)
      .execute('login');
    if(userDetails.recordset.length == 0){
      return {success: false, error: "Email does not exist or you have not verified your email after registering.",};
    }
    userDetails = userDetails.recordset[0];
    if(!this.validPassword(password, userDetails.password)){
      return {success: false, error: "Incorrect password."};
    }
    return {success: true, tokenData: {userId: userDetails.user_id, username: userDetails.username, profileRef: userDetails.profile_ref}};
  }

  static async validUserId(userId){
    const pool = await poolPromise;
    let occurrencesOfUserId = await pool.request()
      .input("user_id", sql.Int, userId)
      .execute("occurrences_of_user_id");
    return (occurrencesOfUserId.recordset[0].count > 0);
  }
}

module.exports = User;