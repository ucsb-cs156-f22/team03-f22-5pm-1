import React from 'react';

import ArticleTable from "main/components/Article/ArticleTable";
import { articleFixtures } from 'fixtures/articleFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Article/ArticleTable',
    component: ArticleTable
};

const Template = (args) => {
    return (
        <ArticleTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    article: []
};

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    article: articleFixtures.threeArticle
};

export const ThreeDatesAsAdmin = Template.bind({});

ThreeDatesAsAdmin.args = {
    article: articleFixtures.threeArticle,
    currentUser: currentUserFixtures.adminUser
};

