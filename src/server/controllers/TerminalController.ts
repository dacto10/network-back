import { query } from "../../utils/functions";

export default class TerminalController {

    public static async loadData() {
        await query(`
            CALL apoc.load.json("file:/terminals.json")
            YIELD value
            CREATE (t:Terminal {mac: value.mac, arp_cache: value.arp_cache, terminal_ip_address: value.terminal_ip_address})
            RETURN t;
        `, {})
    }

    public static async sendMessage(origin: string, destination: string, message: any) {
        const response = await query(`
                MATCH
                    (origin:Terminal {terminal_ip_address: $origin}),
                    (destination:Terminal {terminal_ip_address: $destination}),                
                path = shortestPath((origin)-[*..]-(destination))
                RETURN path;
            `, { origin, destination });

        const path = Object.values(response.records[0])[2][0].segments.map((el: any) => ({
            nodeType: el.start.labels[0],
            properties: el.start.properties
        }));

        path.push({
            nodeType: Object.values(response.records[0])[2][0].segments[Object.values(response.records[0])[2][0].length - 1].end.labels[0],
            properties: Object.values(response.records[0])[2][0].segments[Object.values(response.records[0])[2][0].length - 1].end.properties
        });

        await query(`
                MATCH (t:Terminal {terminal_ip_address: $destination})
                CREATE (m:Message {origin: $origin, subject: $subject, body: $body})
                
                CREATE (t)-[r:HAS]->(m)
                
                RETURN r;
            `, { destination, origin, subject: message.header, body: message.body });

        return path;
    }


    public static async visitWebPage(ip: string, web: string) {
        const response = await query(`
                MATCH
                    (origin:Terminal {terminal_ip_address: $ip}),
                    (destination:Web {url: $web}),                
                path = shortestPath((origin)-[*..]-(destination))
                RETURN path;
            `, { ip, web });

        const path = Object.values(response.records[0])[2][0].segments.map((el: any) => ({
            nodeType: el.start.labels[0],
            properties: el.start.properties
        }));

        path.push({
            nodeType: Object.values(response.records[0])[2][0].segments[Object.values(response.records[0])[2][0].length - 1].end.labels[0],
            properties: Object.values(response.records[0])[2][0].segments[Object.values(response.records[0])[2][0].length - 1].end.properties
        });

        return path;

    }

    public static async getArpCache(ip: string) {
        const response = await query(`
                MATCH 
                    (n:Network)-[:HAS]->(d)
                WITH split(n.network_ip_address, '.') AS networkIP, n AS net, d AS dev, split($ip, '.') AS originIP
                WHERE networkIP[0] = originIP[0] AND networkIP[1] = originIP[1] AND networkIP[2] = originIP[2]
                RETURN dev;
            `, { ip });

        const arpTable = response.records
            .filter((el: any) => el._fields[0].properties.terminal_ip_address != ip)
            .map((el: any) => `"${el._fields[0].labels.includes("Terminal") ? el._fields[0].properties.terminal_ip_address : el._fields[0].properties.private_ip} -- ${el._fields[0].properties.mac}"`);

        await query(`
                MATCH 
                    (t:Terminal {terminal_ip_address: $ip})
                SET t.arp_cache = $arpTable
            `, { ip, arpTable });

        return arpTable;
    }

    public static async createTerminal(terminal: any, network: string) {
        await query(`
            CREATE (t:Terminal { terminal_ip_address: $ip, mac: $mac, arp_cache: [] })
            WITH t AS t
            MATCH (n:Network { network_ip_address: $net_ip})
            CREATE (t)-[r:BELONGS_TO_NETWORK]->(n)
            CREATE (n)-[y:HAS]->(t)
            RETURN t;
        `, { ip: terminal.ip, mac: terminal.mac, net_ip: network })
    }

    public static async deleteTerminal(mac: string) {
        await query(`
            MATCH (t:Terminal { mac: $mac})
            DETACH DELETE t;
        `, { mac })
    }

    public static async getTerminals() {
        const response =  await query(`
            MATCH (t:Terminal)
            RETURN t;
        `, {});

        return response.records.map((el: any) => el._fields[0].properties);
    }

    public static async listMessages(ip: string) {
        const response = await query(`MATCH (m:Message) 
        WHERE (:Terminal {terminal_ip_address: $ip})-[:HAS]->(m)
        RETURN m;`, { ip });

        return response.records.map((el: any) => el._fields[0].properties);
    }

    public static async deleteMessage(origin: string, subject: string, body: string) {
        await query(`MATCH
            (m:Message {origin: $origin, subject: $subject, body: $body}) 
            DETACH DELETE m;
        `, { origin, subject, body });
    }
}