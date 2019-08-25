create table scrapper_channels (
	channelId VARCHAR(200) primary key,
	status VARCHAR(10) not null,
	title VARCHAR(500) null,
	keywords VARCHAR(500) null,
	description text null,
	country VARCHAR(100) null,
	commentCount INTEGER null,
	subscriberCount INTEGER null,
	videoCount INTEGER null,
	viewCount INTEGER null,
	publishedAt TIMESTAMP null,
	createdAt TIMESTAMP not null default current_timestamp,
	updatedAt TIMESTAMP default current_timestamp
);

create table scrapper_videos (
	videoId VARCHAR(200) primary key,
	channelId VARCHAR(200) not null,
	title VARCHAR(300) not null,
	description text not null,

	isCaption INTEGER null,
	duration VARCHAR(50) null,
	language VARCHAR(100) null,
	tags VARCHAR(300) null,

	commentCount INTEGER null,
	dislikeCount INTEGER null,
	favoriteCount INTEGER null,
	likeCount INTEGER null,
	viewCount INTEGER null,

	publishedAt TIMESTAMP not null,
	createdAt TIMESTAMP not null default current_timestamp,
	updatedAt TIMESTAMP default current_timestamp
);

create table scrapper_video_thumbnails (
    idx SERIAL not null primary key,
	videoId VARCHAR(200) not null,
	url VARCHAR(400) not null,
	type VARCHAR(50) not null,
	width INTEGER not null,
	height INTEGER not null,
	createdAt TIMESTAMP not null default current_timestamp,
	updatedAt TIMESTAMP default current_timestamp
);

-- add sequence
create sequence sequence_scrapper_video_thumbnails_idx start 1 increment 1;



create table scrapper_video_captions (
	captionId VARCHAR(200) primary key,
	videoId VARCHAR(200) not null,
	language VARCHAR(100) not null,
	lastUpdated TIMESTAMP not null,
	status VARCHAR(50) not null,
	caption text not null,
	createdAt TIMESTAMP not null default current_timestamp,
	updatedAt TIMESTAMP default current_timestamp
);