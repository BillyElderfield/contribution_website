const { poolPromise, sql } = require('../db')

class Contribution {

    static async create(userId, date, duration, task){
        const pool = await poolPromise;
        let createContribution = await pool.request()
            .input("user_id", sql.Int, userId)
            .input("date", sql.Date, new Date(date))
            .input("duration", sql.Float, duration)
            .input("task", sql.VarChar, task)
            .execute("create_contribution");
    }

    static async getContributionsByProfileRef(profileRef){
        const pool = await poolPromise;
        let contributions = await pool.request()
            .input("profile_ref", sql.VarChar, profileRef)
            .execute("contributions_by_profile_ref")
        return contributions.recordset;
    }
}

module.exports = Contribution;