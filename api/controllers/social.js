const socialModel = require("../models/social")

exports.get_all_users =  (req, res, next) => {

  socialModel.get_all_users().then((data) => {
      // console.log("from controller",data)
        const response = {
          message : "Handling get requests to /users. All users list is provided to you as following",
          users : data
        };
        res.status(200).json(response);

      }).catch(e => console.log(e));
};

exports.get_users_by_page_num =  (req, res, next) => {

  socialModel.get_users_by_page_num(req.params.pageNum).then((data) => {
      // console.log("from controller",data)
        const response = {
          message : "Handling get requests to /someusers. some users list is provided to you as following",
          users : data
        };
        res.status(200).json(response);

      }).catch(e => console.log(e));
};

exports.get_page_count =  (req, res, next) => {

  socialModel.get_page_count().then((data) => {
      // console.log("from controller",data)
        const response = {
          message : "Handling get requests to /users/pagecount. some users list is provided to you as following",
          count : data
        };
        res.status(200).json(response);

      }).catch(e => console.log(e));
};

exports.get_all_friends = (req, res, next) => {
 
  socialModel.get_all_friends(req.params.userId).then((data) => {
    // console.log("from controller",data)
      
      const response = {
        message : "Handling get requests to /friends. All friends list is provided to you as following",
        users : data
      };
      res.status(200).json(response);

    }).catch(e => console.log(e));

};

exports.get_friends_of_friends = (req, res, next) => {

  socialModel.get_friends_of_friends(req.params.userId).then((data) => {
    // console.log("from controller",data)
      
      const response = {
        message : "Handling get requests to /foff. All friends list of your friends is provided to you as following",
        users : data
      };
      res.status(200).json(response);

    }).catch(e => console.log(e));

};


exports.get_user = (req, res, next) => {
 
  const response = {
    message : "Handling get requests to /users. A request  to fetch a single user with userId = " + req.params.userId,
    user : {
      "name": "single user name",
      "locationName": "Siliguri"
  }
  };
  res.status(200).json(response);

};

 

 
