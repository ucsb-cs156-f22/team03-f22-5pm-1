import React from 'react';

import ReviewTable from "main/components/Review/ReviewTable";
import { ucsbDatesFixtures } from 'fixtures/reviewFixtures';

export default {
    title: 'components/Review/ReviewTables',
    component: UCSBDatesTable
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

export const ThreeDates = Template.bind({});

ThreeDates.args = {
    dates: reviewFixtures.threeDates
};


