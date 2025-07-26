import pg from "pg";
class Pool {
    __pool = null;
    connect(options) {
        this.__pool = new pg.Pool(options);
        return this.__pool.query("SELECT 1 + 1;");
    }
    ;
    close() {
        return this.__pool?.end();
    }
    ;
    // Take Care of Security Here !
    query(sql, values) {
        return this.__pool?.query(sql, values);
    }
    ;
}
;
export default new Pool();
