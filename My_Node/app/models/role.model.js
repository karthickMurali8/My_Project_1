module.exports = (Seq, seq) => {
    const role = seq.define('roles_table', {
        id: {
            type: Seq.INTEGER,
            primaryKey: true
        },
        name: {
            type: Seq.STRING
        }
    });
    return role;
}
