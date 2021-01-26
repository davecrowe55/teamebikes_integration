const createNewContact = async (firstname, lastname) => {
    const newlisting = await pool.query(
      `INSERT INTO list (firstname, lastname) values ( $1, $2, $3 )`,
      [dfirstname, lastname]
    );
  }

  module.exports = {
    createNewContact
  }