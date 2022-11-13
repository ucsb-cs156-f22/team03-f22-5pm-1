import React from 'react';

import ReviewTable from "main/components/Review/ReviewTable";
import { reviewsFixtures } from 'fixtures/reviewsFixtures';

export default {
    title: 'components/Review/ReviewTable',
    component: ReviewTable
};

const Template = (args) => {
    return (
        <ReviewTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    dates: []
};

export const ThreeReview = Template.bind({});

ThreeReview.args = {
    dates: reviewsFixtures.threeReview
};


