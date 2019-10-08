import axios from "axios";

export default async function auth(){
    try{
        let res = await axios.post("https://localhost:7034/user/auth", {withCredentials: true});
        if(res.status === 200){
            return {
                success: true,
                username: res.data.username,
                profileRef: res.data.profileRef,
            };
        }
    }
    catch{
        return {success: false};
    }
}
