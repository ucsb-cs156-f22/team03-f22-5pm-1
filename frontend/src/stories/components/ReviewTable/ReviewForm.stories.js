import React from 'react';

import UCSBDateForm from "main/components/Review/ReviewForm"
import { ucsbDatesFixtures } from 'fixtures/reviewFixtures';

export default {
    title: 'components/Review/ReviewForm',
    component: ReviewForm
};


const Template = (args) => {
    return (
        <ReviewForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    review: reviewFixtures.oneDate,
    submitText: "",
    submitAction: () => { }
};
