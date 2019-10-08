const { poolPromise, sql } = require('../db')

class Follow {

    static async getFollowStats(profileRef){
        const pool = await poolPromise;
        let followStats = await pool.request()
            .input("profile_ref", sql.VarChar, profileRef)
            .execute("follow_stats");
        return followStats.recordset[0];
    }

    static async followersByProfileRef(profileRef){
        const pool = await poolPromise;
        let followers = await pool.request()
            .input("profile_ref", sql.VarChar, profileRef)
            .execute("followers_by_profile_ref");
        return followers.recordset[0];
    }
}

module.exports = Follow;