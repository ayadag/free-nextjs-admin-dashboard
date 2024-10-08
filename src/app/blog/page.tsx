import React from 'react';

import { Metadata } from 'next';

import { Card } from '@/components/blog/components/Card';
import SimpleLayout from '@/components/blog/components/SimpleLayout';
import {
  ArticleWithSlug,
  getAllArticles,
} from '@/lib/article';
import { formatDate } from '@/lib/formateDate';

export const metadata: Metadata = {
  title: "Blog | Gluon",
  description: "This is Gluon Blog",
  icons: {
    icon: '/images/logo/Gluon4.png', // /public path
  },
}

const Article = ({ article }: { article: ArticleWithSlug }) => {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        {/* <Card.Title href={`/articles/${article.slug}`}> */}
        <Card.Title href={`/blog/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  );
};

const AriclePage = async () => {
  const articles = await getAllArticles();
  return (
    <SimpleLayout
      // title="Writing on software design, company building, and the aerospace industry."
      title="Writing on crypto currency and decentraized exchange platforms."
      intro="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
};

export default AriclePage;
