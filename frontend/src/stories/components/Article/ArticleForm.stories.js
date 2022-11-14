import React from 'react';

import ArticleForm from "main/components/Article/ArticleForm"
import { articleFixtures } from 'fixtures/articleFixtures';

export default {
    title: 'components/Article/ArticleForm',
    component: ArticleForm
};


const Template = (args) => {
    return (
        <ArticleForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    buttonLabel: "Create",
    submitAction: (data) => { console.log('Create was clicked, parameter to submitAction=',data); }
};

export const Show = Template.bind({});

Show.args = {
    initialCommons: articleFixtures.oneArticle,
    buttonLabel: "Update",
    submitAction: (data) => { console.log('Update was clicked, parameter to submitAction=',data); }
};
