USE [master]
GO
/****** Object:  Database [blog_db]    Script Date: 7/30/2024 5:19:06 PM ******/
CREATE DATABASE [blog_db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'blog_db', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\blog_db.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'blog_db_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\blog_db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [blog_db] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [blog_db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [blog_db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [blog_db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [blog_db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [blog_db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [blog_db] SET ARITHABORT OFF 
GO
ALTER DATABASE [blog_db] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [blog_db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [blog_db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [blog_db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [blog_db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [blog_db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [blog_db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [blog_db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [blog_db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [blog_db] SET  ENABLE_BROKER 
GO
ALTER DATABASE [blog_db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [blog_db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [blog_db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [blog_db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [blog_db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [blog_db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [blog_db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [blog_db] SET RECOVERY FULL 
GO
ALTER DATABASE [blog_db] SET  MULTI_USER 
GO
ALTER DATABASE [blog_db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [blog_db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [blog_db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [blog_db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [blog_db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [blog_db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'blog_db', N'ON'
GO
ALTER DATABASE [blog_db] SET QUERY_STORE = ON
GO
ALTER DATABASE [blog_db] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [blog_db]
GO
/****** Object:  Table [dbo].[category]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category](
	[category_id] [int] IDENTITY(1,1) NOT NULL,
	[title] [varchar](255) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[comments]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[comments](
	[comment_id] [int] IDENTITY(1,1) NOT NULL,
	[post_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
	[content] [varchar](255) NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[comment_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[interests]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[interests](
	[user_id] [int] NOT NULL,
	[category_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[post_category]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[post_category](
	[category_id] [int] NOT NULL,
	[post_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[category_id] ASC,
	[post_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[post_media]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[post_media](
	[media_id] [int] NOT NULL,
	[post_id] [int] NULL,
	[media_url] [varchar](255) NOT NULL,
	[caption] [varchar](255) NULL,
	[media_type] [int] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[media_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[post_reactions]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[post_reactions](
	[reaction_id] [int] NOT NULL,
	[post_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[reaction_id] ASC,
	[post_id] ASC,
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[posts]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[posts](
	[post_id] [int] IDENTITY(1,1) NOT NULL,
	[title] [varchar](30) NOT NULL,
	[content] [varchar](max) NULL,
	[num_views] [int] NULL,
	[avg_rating] [int] NULL,
	[num_ratings] [int] NULL,
	[num_comments] [int] NULL,
	[editor_id] [int] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
	[header_image] [varchar](255) NULL,
 CONSTRAINT [PK__posts__3ED787666CAA46D0] PRIMARY KEY CLUSTERED 
(
	[post_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[rating]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rating](
	[post_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
	[rating] [int] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[post_id] ASC,
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[reactions]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[reactions](
	[reaction_id] [int] IDENTITY(1,1) NOT NULL,
	[reaction_desc] [varchar](255) NULL,
	[emoji] [image] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[reaction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[user_name] [varchar](20) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[city_state_country] [varchar](255) NULL,
	[pass_hash] [varchar](255) NOT NULL,
	[user_role] [int] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
	[about] [varchar](255) NULL,
	[profile_pic] [image] NULL,
	[first_name] [varchar](255) NOT NULL,
	[last_name] [varchar](255) NOT NULL,
	[gender] [varchar](255) NOT NULL,
	[DateOfBirth] [datetime] NOT NULL,
	[phone_num] [varchar](15) NULL,
 CONSTRAINT [PK__users__B9BE370F5C36B11F] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Users_UserName] UNIQUE NONCLUSTERED 
(
	[user_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[views]    Script Date: 7/30/2024 5:19:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[views](
	[post_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
	[created_at] [datetime] NOT NULL,
	[updated_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[post_id] ASC,
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF__users__first_nam__14270015]  DEFAULT ('') FOR [first_name]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF__users__last_name__151B244E]  DEFAULT ('') FOR [last_name]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF__users__gender__160F4887]  DEFAULT ('') FOR [gender]
GO
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [DF__users__DateOfBir__17036CC0]  DEFAULT ('1900-01-01') FOR [DateOfBirth]
GO
ALTER TABLE [dbo].[comments]  WITH CHECK ADD  CONSTRAINT [fk_post_id_comments] FOREIGN KEY([post_id])
REFERENCES [dbo].[posts] ([post_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[comments] CHECK CONSTRAINT [fk_post_id_comments]
GO
ALTER TABLE [dbo].[comments]  WITH CHECK ADD  CONSTRAINT [fk_user_id_comments] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[comments] CHECK CONSTRAINT [fk_user_id_comments]
GO
ALTER TABLE [dbo].[interests]  WITH CHECK ADD  CONSTRAINT [fk_category_id] FOREIGN KEY([category_id])
REFERENCES [dbo].[category] ([category_id])
GO
ALTER TABLE [dbo].[interests] CHECK CONSTRAINT [fk_category_id]
GO
ALTER TABLE [dbo].[interests]  WITH CHECK ADD  CONSTRAINT [fk_user_id] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[interests] CHECK CONSTRAINT [fk_user_id]
GO
ALTER TABLE [dbo].[post_category]  WITH CHECK ADD  CONSTRAINT [fk_category_id_perpost] FOREIGN KEY([category_id])
REFERENCES [dbo].[category] ([category_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[post_category] CHECK CONSTRAINT [fk_category_id_perpost]
GO
ALTER TABLE [dbo].[post_category]  WITH CHECK ADD  CONSTRAINT [fk_post_id_category] FOREIGN KEY([post_id])
REFERENCES [dbo].[posts] ([post_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[post_category] CHECK CONSTRAINT [fk_post_id_category]
GO
ALTER TABLE [dbo].[post_media]  WITH CHECK ADD  CONSTRAINT [fk_post_id] FOREIGN KEY([post_id])
REFERENCES [dbo].[posts] ([post_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[post_media] CHECK CONSTRAINT [fk_post_id]
GO
ALTER TABLE [dbo].[post_reactions]  WITH CHECK ADD  CONSTRAINT [fk_post_id_reactions] FOREIGN KEY([post_id])
REFERENCES [dbo].[posts] ([post_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[post_reactions] CHECK CONSTRAINT [fk_post_id_reactions]
GO
ALTER TABLE [dbo].[post_reactions]  WITH CHECK ADD  CONSTRAINT [fk_reaction_id] FOREIGN KEY([reaction_id])
REFERENCES [dbo].[reactions] ([reaction_id])
GO
ALTER TABLE [dbo].[post_reactions] CHECK CONSTRAINT [fk_reaction_id]
GO
ALTER TABLE [dbo].[post_reactions]  WITH CHECK ADD  CONSTRAINT [fk_user_id_reactions] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[post_reactions] CHECK CONSTRAINT [fk_user_id_reactions]
GO
ALTER TABLE [dbo].[posts]  WITH CHECK ADD  CONSTRAINT [fk_editor_id] FOREIGN KEY([editor_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[posts] CHECK CONSTRAINT [fk_editor_id]
GO
ALTER TABLE [dbo].[rating]  WITH CHECK ADD  CONSTRAINT [fk_post_id_rating] FOREIGN KEY([post_id])
REFERENCES [dbo].[posts] ([post_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[rating] CHECK CONSTRAINT [fk_post_id_rating]
GO
ALTER TABLE [dbo].[rating]  WITH CHECK ADD  CONSTRAINT [fk_user_id_rating] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[rating] CHECK CONSTRAINT [fk_user_id_rating]
GO
ALTER TABLE [dbo].[views]  WITH CHECK ADD  CONSTRAINT [fk_post_id_views] FOREIGN KEY([post_id])
REFERENCES [dbo].[posts] ([post_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[views] CHECK CONSTRAINT [fk_post_id_views]
GO
ALTER TABLE [dbo].[views]  WITH CHECK ADD  CONSTRAINT [fk_user_id_views] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[views] CHECK CONSTRAINT [fk_user_id_views]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [CK__users__email__37A5467C] CHECK  (([email] like '%@%'))
GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [CK__users__email__37A5467C]
GO
USE [master]
GO
ALTER DATABASE [blog_db] SET  READ_WRITE 
GO
