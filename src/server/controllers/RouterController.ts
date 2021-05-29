import { query } from "../../utils/functions";

export default class RouterController {

    public static async loadData() {
        await query(`
            CALL apoc.load.json("file:/routers.json")
            YIELD value
            CREATE (r:Router {mac: value.mac, public_ips: value.public_ips, private_ip: value.private_ip})
            RETURN r;
        `, {})
    }

    public static async createRouter(router: any) {
        await query(`
            CREATE (r:Router {mac: $mac, private_ip: $private_ip, public_ips: $public_ips})
        `, {mac: router.mac, private_ip: router.private_ip, public_ips: router.public_ips})
    }

    public static async deleteRouter(mac: string) {
        await query(`
            MATCH (r:Router {mac: $mac})
            DETACH DELETE r;
        `, { mac })
    }

    public static async getRouters() {
        const response = await query(`
            MATCH (r:Router)
            RETURN r;
        `, {});
        
        return response.records.map((el: any) => el._fields[0].properties) 
    }
}