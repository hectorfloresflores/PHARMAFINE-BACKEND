require('../db/mongodb-connect');
const {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser,
    getUsers
} = require('../db/users')
let newUser = {
    name: "roberto",
    lastname: "gutierrez",
    email: "roberto@gmail.com",
    password: "1234",
    url: "",
    genre: "MAN",
    role: "USER"
}

test('adds 1 + 2 to equal 3', () => {
    let getCount;
    getUsers().then(result =>{
        getCount = result.size;
    })
    let getCount2;
    createUser(newUser).then(result =>{
        getUsers().then(result =>{
            getCount2 = result.size;
        })
    })
    expect(getCount).toBe(getCount2+1);
});