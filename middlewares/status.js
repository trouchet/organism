import axios from 'axios'

let animal = 'dog';

export const statusMW = (err, req, res, next) => {
	res.statusImagePath = ":)"
	next();
};

