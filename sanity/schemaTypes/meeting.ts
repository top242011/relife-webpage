import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'meeting',
    title: 'Meeting (ประชุมสภา)',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Meeting Title',
            type: 'string',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'datetime',
        }),
        defineField({
            name: 'type',
            title: 'Meeting Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Central (ส่วนกลาง)', value: 'central' },
                    { title: 'Center (ศูนย์)', value: 'center' },
                ],
                layout: 'radio'
            },
            initialValue: 'central'
        }),
        defineField({
            name: 'campus',
            title: 'Campus',
            type: 'string',
            options: {
                list: [
                    { title: 'Rangsit', value: 'Rangsit' },
                    { title: 'Lampang', value: 'Lampang' },
                    { title: 'Tha Prachan', value: 'Tha Prachan' },
                ]
            },
            hidden: ({ document }) => document?.type !== 'center'
        }),
        defineField({
            name: 'attendees',
            title: 'Attendees',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'member',
                            title: 'Member',
                            type: 'reference',
                            to: [{ type: 'candidate' }],
                        }),
                        defineField({
                            name: 'status',
                            title: 'Status',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Present (เข้าร่วม)', value: 'present' },
                                    { title: 'Leave (ลา)', value: 'leave' },
                                    { title: 'Absent (ขาด)', value: 'absent' },
                                ],
                            },
                            initialValue: 'present'
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'member.name.en',
                            subtitle: 'status'
                        }
                    }
                },
            ],
        }),
        defineField({
            name: 'motions',
            title: 'Motions (ญัตติ)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Motion Title',
                            type: 'string'
                        }),
                        defineField({
                            name: 'proposer',
                            title: 'Proposer',
                            type: 'reference',
                            to: [{ type: 'candidate' }]
                        })
                    ]
                }
            ]
        }),
        defineField({
            name: 'votes',
            title: 'Votes (การลงมติ)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'voteItem',
                    title: 'Vote Item',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Topic',
                            type: 'string',
                        }),
                        defineField({
                            name: 'results',
                            title: 'Vote Results',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        defineField({
                                            name: 'member',
                                            title: 'Member',
                                            type: 'reference',
                                            to: [{ type: 'candidate' }],
                                        }),
                                        defineField({
                                            name: 'vote',
                                            title: 'Vote',
                                            type: 'string',
                                            options: {
                                                list: [
                                                    { title: 'Approve (เห็นชอบ)', value: 'approve' },
                                                    { title: 'Disapprove (ไม่เห็นชอบ)', value: 'disapprove' },
                                                    { title: 'Abstain (งดออกเสียง)', value: 'abstain' },
                                                    { title: 'No Vote (ไม่ลงคะแนน)', value: 'no_vote' },
                                                ],
                                            },
                                        }),
                                    ],
                                    preview: {
                                        select: {
                                            title: 'member.name.en',
                                            subtitle: 'vote'
                                        }
                                    }
                                },
                            ],
                        }),
                    ],
                },
            ],
        }),
    ],
})
