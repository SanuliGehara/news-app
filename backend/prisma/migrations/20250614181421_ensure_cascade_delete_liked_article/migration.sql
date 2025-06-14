-- DropForeignKey
ALTER TABLE "LikedArticle" DROP CONSTRAINT "LikedArticle_articleId_fkey";

-- AddForeignKey
ALTER TABLE "LikedArticle" ADD CONSTRAINT "LikedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
