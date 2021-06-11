import { query } from "../../utils/functions";

export default class NetworkController {

    public static async loadData() {
        await query(`
            CALL apoc.load.json("file:/networks.json")
            YIELD value
            CREATE (n:Network {network_ip_address: value.network_ip_address, mask: value.mask, type: value.type})
            RETURN n;
        `, {})
    }

    public static async connectTerminals() {
        await query(`
            MATCH 
                (n:Network),
                (t:Terminal)
            WITH split(n.network_ip_address, '.') AS networkIP, split(t.terminal_ip_address, '.') AS terminalIP, n AS net, t AS ter
            WHERE networkIP[0] = terminalIP[0] AND networkIP[1] = terminalIP[1] AND networkIP[2] = terminalIP[2]
            CREATE (ter)-[r:BELONGS_TO_NETWORK]->(net)
            CREATE (net)-[y:HAS]->(ter)
            RETURN r, y;
        `, {})
    }

    public static async connectServers() {
        await query(`
            MATCH 
                (n:Network),
                (s:Server)
            WITH split(n.network_ip_address, '.') AS networkIP, split(s.server_ip_address, '.') AS serverIP, n AS net, s AS sv
            WHERE networkIP[0] = serverIP[0] AND networkIP[1] = serverIP[1] AND networkIP[2] = serverIP[2]
            CREATE (sv)-[r:BELONGS_TO_NETWORK]->(net)
            CREATE (net)-[y:HAS]->(sv)
            RETURN r, y;
        `, {})
    }

    public static async connectRouters() {
        await query(`
            MATCH 
                (n:Network),
                (r:Router)
            UNWIND r.public_ips AS publicIP
            WITH split(n.network_ip_address, '.') AS networkIP, n AS net, r AS rt, split(publicIP, '.') AS routerIP
            WHERE networkIP[0] = routerIP[0] AND networkIP[1] = routerIP[1] AND networkIP[2] = routerIP[2]
            CREATE (rt)-[r:BELONGS_TO_NETWORK]->(net)
            CREATE (net)-[y:HAS]->(rt)
            return y, r;
        `, {});

        await query(`
            MATCH 
                (n:Network),
                (r:Router)
            WITH split(n.network_ip_address, '.') AS networkIP, split(r.private_ip, '.') AS routerIP, n AS net, r AS rt
            WHERE networkIP[0] = routerIP[0] AND networkIP[1] = routerIP[1] AND networkIP[2] = routerIP[2]
            CREATE (rt)-[r:BELONGS_TO_NETWORK]->(net)
            CREATE (net)-[y:HAS]->(rt)
            RETURN r, y;
        `, {})
    }

    public static async createNetwork(network: any) {
        await query(`
            CREATE (n:Network { network_ip_address: $ip, mask: $mask, type: $type })
            RETURN n;
        `, { ip: network.ip, mask: network.mask, type: network.type });
        await query(`
            MATCH ()-[r]->()
            DELETE r;
        `, {})
    }

    public static async deleteNetwork(ip: string) {
        await query(`
            MATCH (n:Network { network_ip_address: $ip})
            DETACH DELETE n;
        `, { ip })
    }

    public static async getNetworks() {
        const response = await query(`
            MATCH (n:Network)
            RETURN n;
        `, {});

        return response.records.map((el: any) => el._fields[0].properties);
    }

    public static async clear() {
        await query(`
            MATCH (q)
            DETACH DELETE q;
        `, {});
    }

    public static async getAllNodes() {
        const response = await query(`
            MATCH (q)
            RETURN q;
        `, {});

        return response;
    }

    public static async getAllEdges () {
        const response = await query(`
        MATCH ()-[r]->() RETURN r;
        `, {});

        return response;
    }
}