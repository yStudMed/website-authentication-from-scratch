import pg, { PoolConfig } from "pg";

class Pool {
    private __pool: pg.Pool | null = null;
    public connect(options: PoolConfig) {
        this.__pool = new pg.Pool(options);
        return this.__pool.query("SELECT 1 + 1;");
    };
    public close() {
        return this.__pool?.end();
    };
    // Take Care of Security Here !
    public query(sql: string, values: any[]) {
        return this.__pool?.query(sql, values);
    };
};

export default new Pool();