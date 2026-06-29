import axios from "axios";

const token = process.env.ACCESS_TOKEN;
const url = "http://4.224.186.213/evaluation-service/logs";
async function Log(stack, level, packageName, message) {
    try {
        const response = await axios.post(
            url,
            {
                stack: stack,
                level: level,
                package: packageName,
                message: message
            },
            {
                headers: {
                    Authorization: "Bearer " +token,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (err) {
        console.log("Failed to send log " + err.message);
    }
}
export default Log;