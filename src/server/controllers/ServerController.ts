import { query } from "../../utils/functions";

export default class ServerController {

    public static async loadData() {
        await query(`
            CALL apoc.load.json("file:/servers.json")
            YIELD value
            CREATE (s:Server {mac: value.mac, server_ip_address: value.server_ip_address})
            RETURN s;
        `, {})

        await query(`
            CALL apoc.load.json("file:/webs.json")
            YIELD value
            CREATE (w:Web {server_ip_address: value.server_ip, url: value.url})
            RETURN w;
        `, {})

        await this.connectWebs();
    }

    public static async connectWebs() {
        await query(`
            MATCH 
                (s:Server),
                (w:Web)
            WHERE s.server_ip_address = w.server_ip_address
            CREATE (s)-[r:HOST]->(w)
            RETURN r;
        `, {})
    }

    public static async createServer(server: any) {
        await query(`
            CREATE (s:Server {mac: $mac, server_ip_address: $ip})
        `, {mac: server.mac, ip: server.ip});

        await query(`
            MATCH ()-[r]->()
            DELETE r;
        `, {})
    }

    public static async deleteServer(mac: string) {
        await query(`
            MATCH (s:Server {mac: $mac})
            DETACH DELETE s;
        `, { mac })
    }

    public static async getServers() {
        const response =  await query(`
            MATCH (s:Server)
            RETURN s;
        `, {});

        return response.records.map((el: any) => el._fields[0].properties);       
    }

    public static async getWebs() {
        const response = await query(`
            MATCH (w:Web)
            RETURN w;
        `, {});
        return response.records.map((el: any) => el._fields[0].properties);
    }

    public static async createWeb(web: any) {
        await query(`
            CREATE (w:Web {server_ip_address: $ip, url: $url})
            RETURN w;
        `, {ip: web.server_ip, url: web.url});

        await query(`
            MATCH ()-[r]->()
            DELETE r;
        `, {})
    }

    public static async deleteWeb(url: string) {
        await query(`
            MATCH (w:Web {url: $url})
            DETACH DELETE w;
        `, { url })
    }
}