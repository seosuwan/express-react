import db from '../models/index.js'
import getDatabase from '../lambdas/getDatabase.js'

export default function UserService() {

    const User = db.User
    const dbo = getDatabase()
    const dbConnect = dbo.getDb();
   
    return {
       
        join(req, res) {
            new User(req.body).save(function (err) {
                if (err) {
                    res
                        .status(500)
                        .send({message: err});
                    console.log('회원가입 실패')
                    return;
                } else {
                    res
                        .status(200)
                        .json({ok: 'ok'})

                }
            })
            /**const matchDocument = {
                userid: req.body.userid,
                password: req.body.password,
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                birth: req.body.birth,
                address: req.body.address
            };
            dbConnect
                .collection("users")
                .insertOne(matchDocument, function (err, result) {
                    if (err) {
                        res
                            .status(400)
                            .send("Error inserting matches!");
                    } else {
                        console.log(`Added a new match with id ${result.insertedId}`);
                        res
                            .status(204)
                            .send();
                    }
                }) */
        },
        loadMyInfoAPI(req,res){
            console.log("왔남")
            User.findOne({
                userid: req.body.userid
            }, function (err, user) {
                if (err) 
                    throw err
                if (!user) {
                    res
                        .status(401)
                        .send({success: false, message: '해당 ID가 존재하지 않습니다'});
                } else {   
                    console.log("토큰좀 보내봐랑")
                    user.findByToken((err, user) => {
                        if (err) 
                            res
                                .status(400)
                                .send(err)

                            // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                            res
                                
                                .status(200)
                                .json(user)})
                }
            })
        },
        login(req, res) {
            
            User.findOne({
                userid: req.body.userid
            },
            // console.log("req.session : "),

            function (err, user) {

                
               
                if (err) 
                    throw err
                if (!user) {
                    res
                        .status(401)
                        .send({success: false, message: '해당 ID가 존재하지 않습니다'});
                } else {
                    console.log(' ### 로그인 정보: ' + JSON.stringify(user.headers))
                    
                    user.comparePassword(req.body.password, function (_err, isMatch) {
                        if (!isMatch) {
                            res
                                .status(401)
                                .send({message:'FAIL'});
                        } else {
                            user.generateToken((err, user) => {
                                if (err) 
                                    res
                                        .status(400)
                                        .send(err)

                                    // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                                
                                    res

                                        .status(200)
                                        .json(user)
                                        // console.log(res.json(),"뭐가들어있을까요")
                                    
                            })
                        }
                    })
                }
            })

            /**const matchDocument = {
                userid: req.body.userid,
                password: req.body.password,
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                birth: req.body.birth,
                address: req.body.address
            };
            dbConnect
                .collection("users")
                .insertOne(matchDocument, function (err, result) {
                    if (err) {
                        res
                            .status(400)
                            .send("Error inserting matches!");
                    } else {
                        console.log(`Added a new match with id ${result.insertedId}`);
                        res
                            .status(204)
                            .send();
                    }
                }) */
        },
        logout() {
            console.log(`서버 로그아웃 `);
            req.logout();
            res.json({success: true, msg: '로그아웃'});

        },
        checkDuplicateUserid(req, res) {
            User
                .findById({userid: req.body.userid})
                .exec((err, user) => {
                    if (err) {
                        res
                            .status(500)
                            .send({message: err});
                        return;
                    }
                    if (user) {
                        res
                            .status(400)
                            .send({message: "ID가 이미 존재합니다"});
                        return;
                    }
                })
        },
        getUserById(userid){
            User
                .findById({userid: userid})
                .exec((_err, user) => {
                    return user
                })
        }

    } // return
}

