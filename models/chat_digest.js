module.exports = {
	name:"chat_digest",
	engine:"InnoDB",
	charset:"utf8mb4",
	collation:"utf8mb4_unicode_ci",
	columns:[
		{
			name:"id",
			type:"int(11)",
			isNull:false,
			isPrimaryKey:true,
			autoIncrement:true
		}
	]
}
