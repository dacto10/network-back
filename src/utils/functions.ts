import { driver } from '../neo4j/driver';

export const query = async (query: string, params: any) => {
    const session = driver.session({database: 'network'});
    const response = await session.run(query, params);
    session.close();
    return response;
}