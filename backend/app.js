var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
// const fileUpload = require('express-fileupload');
const fs = require('fs')
const _ = require('lodash');
const bcrypt = require('bcrypt')
// const multer = require('multer')
const path = require('path')
const saltRounds = 10
var jwt = require('jsonwebtoken')
const secret = 'Team0_WebContemp'
var moment = require('moment')
require('dotenv').config()

app.use(cors())
// app.use(bodyParser())
app.use(bodyParser({ limit: '50mb' }));

const mysql = require('mysql2');
const { result } = require('lodash')

app.use('/images', express.static(path.join(__dirname, 'images')))

var db = {
	user: process.env.DATABASE_USER,
	host: process.env.DATABASE_HOST,
	password: process.env.DATABASE_PASSWORD,
	dateStrings: true,
	database: process.env.DATABASE_DB_NAME,
};

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(db); // Recreate the connection, since the old one cannot be reused.
	connection.connect(function (err) {              // The server is either down
		if (err) {                                  // or restarting (takes a while sometimes).
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
		}                                     // to avoid a hot loop, and to allow our node script to
	});                                     // process asynchronous requests in the meantime.
	// If you're also serving http, display a 503 error.
	connection.on('error', function (err) {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
			handleDisconnect();                         // lost due to either server restart, or a
		} else {                                      // connnection idle timeout (the wait_timeout
			throw err;                                  // server variable configures this)
		}
	});
}

handleDisconnect();

app.post('/register', jsonParser, function (req, res, next) {
	connection.query(
		'SELECT * FROM users WHERE u_username = ?',
		[req.body.username],
		function (err, users, fields) {
			if (err) {
				res.json({ status: 'error', message: err })
				return
			}
			if (users.length == 0) {
				bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
					connection.query(
						'INSERT INTO users (u_username, u_password, u_fname, u_lname, u_birthdate, u_gender) VALUES (?, ?, ?, ?, ?, ?)',
						[req.body.username, hash, req.body.fname, req.body.lname, req.body.birthdate, req.body.gender],
						function (err, results, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								return
							}
							var token = jwt.sign({ username: req.body.username }, secret, { expiresIn: '3h' });
							res.json({ status: 'ok', message: 'login success', token })
						}
					)
				})
			} else {
				res.json({ status: 'error' })
				return
			}
		}
	)
})

app.post('/login', jsonParser, function (req, res, next) {
	connection.query(
		'SELECT * FROM users WHERE u_username = ?',
		[req.body.username],
		function (err, users, fields) {
			if (err) {
				res.json({ status: 'error', message: err })
				return
			}
			if (users.length == 0) {
				res.json({ status: 'error', message: 'not found user' })
				return
			}
			bcrypt.compare(req.body.password, users[0].u_password, function (err, isLogin) {
				if (isLogin) {
					var token = jwt.sign({ username: users[0].u_username }, secret);
					res.json({ status: 'ok', message: 'login success', token })
				} else {
					res.json({ status: 'error', message: 'login failed' })
				}
			});
		}
	)
})

app.post('/updatepassword', jsonParser, function (req, res, next) {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, users, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				}
				if (users.length == 0) {
					res.json({ status: 'error', message: 'not found user' })
					return
				}
				bcrypt.compare(req.body.password, users[0].u_password, function (err, isLogin) {
					if (isLogin) {
						bcrypt.hash(req.body.newpassword, saltRounds, function (err, hash) {
							connection.query(
								'UPDATE users SET u_password = ? WHERE u_username = ?',
								[hash, decoded.username],
								function (err, results, fields) {
									if (err) {
										res.json({ status: 'error', message: err })
										return
									}
									res.json({ status: 'ok', })
								}
							)
						})
					} else {
						res.json({ status: 'error' })
					}
				});
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
	}
})

app.post('/authen', jsonParser, function (req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		res.json({ status: 'ok', decoded })
	} catch (err) {
		res.json({ status: 'error', message: err.message })
	}
})

app.post('/updateinfo', jsonParser, function (req, res, next) {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'UPDATE users SET u_fname = ?, u_lname = ?, u_birthdate = ?, u_gender = ?, u_bio = ? WHERE u_username = ?',
			[req.body.fname, req.body.lname, req.body.birthdate, req.body.gender, req.body.bio, decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					res.json({ status: 'ok' })
				}
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
		return
	}

})

app.post('/upload', jsonParser, (req, res) => {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					// console.log(decoded.username)
					connection.query(
						'UPDATE users SET u_image = ? WHERE u_username = ?',
						[req.body.image, decoded.username],
						function (err, results, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								console.log("upload image error")
								return
							} else {
								res.json({ status: 'ok' })
							}
						}
					)
				}
			}
		)
	} catch (err) {
		try {
			var path = process.cwd() + '/images/' + req.file.filename;
			fs.unlinkSync(path)
			//file removed
		} catch (err) {
			console.error(err)
		}
	}

})

app.post('/profile', jsonParser, (req, res, next) => {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users LEFT JOIN genders ON users.u_gender=genders.g_id WHERE u_username = ?',
			[decoded.username],
			function (err, profile, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				}
				res.json({ status: 'ok', profile })
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
	}
})

app.post('/choose', jsonParser, function (req, res, next) {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, first, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				}
				connection.query(
					'SELECT * FROM users WHERE u_username = ?',
					[req.body.usersecond],
					function (err, second, fields) {
						if (err) {
							res.json({ status: 'error', message: err })
							return
						} else {
							connection.query(
								'SELECT * FROM matched WHERE m_firstuser = ? AND m_seconduser = ?',
								[second[0].u_id, first[0].u_id],
								function (err, matched, fields) {
									if (err) {
										res.json({ status: 'error', message: err })
										return
									}
									if (matched.length > 0) {
										if (req.body.matched == null) {
											req.body.matched = 1
										}
										connection.query(
											'UPDATE matched SET m_matched = ? WHERE m_firstuser = ? AND m_seconduser = ?',
											[req.body.matched, second[0].u_id, first[0].u_id],
											function (err, results, fields) {
												if (err) {
													res.json({ status: 'error', message: err })
													return
												}
												res.json({ status: 'ok' })
											}
										)
									} else {
										connection.query(
											'INSERT INTO matched (m_firstuser, m_seconduser, m_matched) VALUES (?, ?, ?)',
											[first[0].u_id, second[0].u_id, req.body.matched],
											function (err, results, fields) {
												if (err) {
													res.json({ status: 'error', message: err })
													return
												}
												res.json({ status: 'ok' })
											}
										)
									}
								}
							)

						}
					}
				)
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
	}
})

app.get('/genders', jsonParser, function (req, res, next) {
	connection.query(
		'SELECT * FROM genders',
		function (err, genders, fields) {
			if (err) {
				res.json({ status: 'error', message: err })
				return
			}
			if (genders.length == 0) {
				res.json({ status: 'error', message: 'not found genders' })
				return
			}
			res.json({ status: 'ok', genders })
		}
	)
})

app.post('/getinterests', jsonParser, function (req, res, next) {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					connection.query(
						'SELECT * FROM interests WHERE i_u_id = ?',
						[results[0].u_id],
						function (err, interests, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								return
							} else {
								res.json({ status: 'ok', interests })
							}
						}
					)
				}
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
	}
})


app.post('/matched', jsonParser, function (req, res, next) {
	let profile1 = null;
	let profile2 = null;
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					// console.log(results[0].id)
					connection.query(
						'SELECT * FROM matched LEFT JOIN users ON matched.m_firstuser=users.u_id LEFT JOIN genders ON users.u_gender=genders.g_id WHERE matched.m_seconduser = ? AND matched.m_matched = 1',
						[results[0].u_id],
						function (err, first, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								return
							} else {
								profile1 = first;
							}
						}
					)
					connection.query(
						'SELECT * FROM matched LEFT JOIN users ON matched.m_seconduser=users.u_id LEFT JOIN genders ON users.u_gender=genders.g_id WHERE matched.m_firstuser = ? AND matched.m_matched = 1',
						[results[0].u_id],
						function (err, second, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								return
							} else {
								profile2 = second;
								res.json({ status: 'ok', profile1, profile2 })
							}
						}
					)
				}
			}
		)
	} catch (err) {
		handleDisconnect();
		res.json({ status: 'error', message: err })
	}
})


app.post('/find', jsonParser, (req, res, next) => {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					let favGender
					connection.query(
						'SELECT * FROM matched LEFT JOIN users ON matched.m_firstuser=users.u_id LEFT JOIN genders ON users.u_gender=genders.g_id WHERE matched.m_seconduser = ? AND matched.m_matched IS NULL',
						[results[0].u_id],
						function (err, data, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								return
							} else if (data.length > 0) {
								connection.query(
									'SELECT * FROM interests WHERE i_u_id = ?',
									[results[0].u_id],
									function (err, interests, fields) {
										if (err) {
											res.json({ status: 'error', message: err })
											return
										} else {
											favGender = interests
											let profile
											for (let i = 0; i < data.length; i++) {
												for (let j = 0; j < favGender.length; j++) {
													if (favGender[j].i_g_id === data[i].u_gender) {
														profile = data[i]
														res.json({ status: 'ok', profile })
														return;
													}
												}
											}
											res.json({ status: 'error', message: err })
											return
										}
									}
								)

							} else {
								let userId = results[0].u_id
								let allUser;
								let choosed1;
								let choosed2;
								connection.query(
									'SELECT * FROM matched WHERE m_seconduser = ? AND (m_matched=0 OR m_matched=1)',
									[userId],
									function (err, results, fields) {
										if (err) {
											res.json({ status: 'error', message: err })
											return
										} else {
											choosed1 = results;
											connection.query(
												'SELECT * FROM matched WHERE m_firstuser = ? AND (m_matched=0 OR m_matched=1 OR m_matched IS NULL)',
												[userId],
												function (err, results, fields) {
													if (err) {
														res.json({ status: 'error', message: err })
														return
													} else {
														choosed2 = results;
														connection.query(
															'SELECT * FROM interests WHERE i_u_id = ?',
															[userId],
															function (err, interests, fields) {
																if (err) {
																	res.json({ status: 'error', message: err })
																	return
																} else {
																	favGender = interests
																	// console.log(favGender)
																	connection.query(
																		'SELECT * FROM users LEFT JOIN genders ON users.u_gender=genders.g_id WHERE users.u_username != ?',
																		[decoded.username],
																		function (err, results, fields) {
																			if (err) {
																				res.json({ status: 'error', message: err })
																				return
																			} else {
																				let check = 0
																				allUser = results;
																				for (let i = 0; i < allUser.length; i++) {
																					check = 0
																					if (choosed1 !== null) {
																						for (let j = 0; j < choosed1.length; j++) {
																							if (choosed1[j].m_firstuser === allUser[i].u_id) {
																								check = 1
																								break
																							}
																						}
																					}
																					if (check === 0) {
																						for (let k = 0; k < choosed2.length; k++) {
																							if (choosed2[k].m_seconduser === allUser[i].u_id) {
																								check = 1
																								break
																							}
																						}
																					} else {
																						continue;
																					}
																					if (check === 0) {
																						for (let x = 0; x < favGender.length; x++) {
																							if (favGender[x].i_g_id === allUser[i].u_gender) {
																								let profile = allUser[i]
																								res.json({ status: 'ok', profile })
																								return;
																							}

																						}
																					}
																				}
																				res.json({ status: 'error', message: "Not found" })
																				return;
																			}
																		}
																	)
																}
															}
														)
													}
												}
											)
										}
									}
								)
							}
						}
					)

				}
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
	}
})

app.post('/findall', jsonParser, function (req, res, next) {
	try {
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					let userId = results[0].u_id
					let allUser;
					let choosed1;
					let choosed2;
					connection.query(
						'SELECT * FROM matched WHERE m_seconduser = ? AND (m_matched=0 OR m_matched=1)',
						[userId],
						function (err, results, fields) {
							if (err) {
								res.json({ status: 'error', message: err })
								return
							} else {
								choosed1 = results;
								connection.query(
									'SELECT * FROM matched WHERE m_firstuser = ? AND (m_matched=0 OR m_matched=1 OR m_matched IS NULL)',
									[userId],
									function (err, results, fields) {
										if (err) {
											res.json({ status: 'error', message: err })
											return
										} else {
											choosed2 = results;
											connection.query(
												'SELECT * FROM interests WHERE i_u_id = ?',
												[userId],
												function (err, interests, fields) {
													if (err) {
														res.json({ status: 'error', message: err })
														return
													} else {
														favGender = interests
														connection.query(
															'SELECT * FROM users LEFT JOIN genders ON users.u_gender=genders.g_id WHERE users.u_username != ?',
															[decoded.username],
															function (err, results, fields) {
																if (err) {
																	res.json({ status: 'error', message: err })
																	return
																} else {
																	allUser = results;
																	for (let i = 0; i < allUser.length; i++) {
																		check = 0
																		if (choosed1 !== null) {
																			for (let j = 0; j < choosed1.length; j++) {
																				if (choosed1[j].c_firstuser === allUser[i].u_id) {
																					check = 1
																					break
																				}
																			}
																		}
																		if (check === 0) {
																			for (let k = 0; k < choosed2.length; k++) {
																				if (choosed2[k].c_seconduser === allUser[i].u_id) {
																					check = 1
																					break
																				}
																			}
																		} else {
																			continue;
																		}
																		if (check === 0) {
																			for (let x = 0; x < favGender.length; x++) {
																				if (favGender[x].f_g_id === allUser[i].u_gender) {
																					let profile = allUser[i]
																					res.json({ status: 'ok', profile })
																					return;
																				}

																			}
																		}
																	}
																	res.json({ status: 'error' })
																	return;
																}
															}
														)
													}
												}
											)
										}
									}
								)
							}
						}
					)



				}
			}
		)
	} catch (err) {
		res.json({ status: 'error', message: err })
	}

})


app.post('/addinterests', jsonParser, function (req, res, next) {
	try {
		let userId;
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'SELECT * FROM users WHERE u_username = ?',
			[decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					userId = results[0].u_id
				}
			}
		)
		connection.query(
			'SELECT * FROM genders',
			function (err, genders, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {

					let listGender = req.body.listGender
					let check = 0
					for (let i = 0; i < genders.length; i++) {
						check = 0
						for (let j = 0; j < listGender.length; j++) {
							if (genders[i].g_id == listGender[j]) {
								check = 1

								connection.query(
									'SELECT * FROM interests WHERE i_u_id = ? AND i_g_id = ?',
									[userId, listGender[j]],
									function (err, interests, fields) {
										if (err) {
											res.json({ status: 'error', message: err })
											return
										} else {
											// console.log(favorite.length)
											if (interests.length < 1) {
												connection.query(
													'INSERT INTO interests (i_u_id, i_g_id) VALUES (?, ?)',
													[userId, listGender[j]],
													function (err, results, fields) {
														if (err) {
															res.json({ status: 'error', message: err })
															return
														}
													}
												)

											}
										}
									}
								)
							}
						}
						if (check == 0) {
							connection.query(
								'DELETE FROM interests WHERE i_u_id = ? AND i_g_id = ?',
								[userId, genders[i].g_id],
								function (err, results, fields) {
									if (err) {
										res.json({ status: 'error', message: err })
										return
									}
								}
							)
						}
					}
					res.json({ status: 'ok' })
				}
			}
		)
	} catch (err) {
		handleDisconnect();
		res.json({ status: 'error', message: err })
	}
})

app.post('/music', jsonParser, function (req, res, next) {
	try {
		let userId;
		const token = req.body.token.split(' ')[1]
		var decoded = jwt.verify(token, secret);
		connection.query(
			'UPDATE users SET u_music = ? WHERE u_username = ?',
			[req.body.music, decoded.username],
			function (err, results, fields) {
				if (err) {
					res.json({ status: 'error', message: err })
					return
				} else {
					res.json({ status: 'ok' })
				}
			}
		)
	} catch (err) {
		handleDisconnect();
		res.json({ status: 'error', message: err })
	}
})

app.listen(3333, function () {
	console.log('CORS-enabled web server listening on port 3333')
})