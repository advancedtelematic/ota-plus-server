const assets = "/assets/img/whats-new/";

//when you want to add the new notifications just add v2(ot the next number) as the last!! object ob the whatsNew

//name the first slide introduction if you do not want see it in what's new Page

export const whatsNew = {
    v1: {
        dataOfRelease: "10/10/2018",
        total: 6,
        slides: {
            introduction: {
                feature: {
                    title: "",
                    message: "The workflows for grouping devices and creating campaigns has changed. Would you like to see a short walkthrough of the changes?",
                    url: undefined,
                    image: undefined,
                },
                step: {
                    id: "introduction",
                    order: 1,
                    next: "smartGroups",
                    previous: undefined,
                },
                buttons: [ "Don't ask me again", "Later", "Yes" ],
            },
            smartGroups: {
                feature: {
                    title: "Introducing the Smart group",
                    message: "Smart groups give you a new way to group your devices. With smart groups, you can group devices by specific filter criteria rather than adding them one by one. For example, if you have over 1,000 devices, you probably don't want to manually sort them into fixed groups. Instead, you could create a smart group for a specific model and filter based on the device ID. In your smart group, you could then filter for your required model and manufacturer.\n" +
                        "If you're only testing with a few devices, you can still use fixed groups - but smart groups give you a way to easily target large numbers of devices.",
                    url: "/devices",
                    popoverImage: {
                        src: assets + "v1/" + "01__whats-new-feature__smart-group.svg",
                    },
                    blogImage: {
                        src: assets + "v1/blog/" + "01__whats-new-feature__smart-group.svg",
                    },
                },
                step: {
                    id: "smartGroups",
                    order: 2,
                    next: "smartFilters",
                    previous: "introduction",
                },
            },
            smartFilters: {
                feature: {
                    title: "More about filter criteria for smart groups",
                    message: "Currently, you can only filter devices by the device ID. If your device is a vehicle, the device ID should be the Vehicle Identification Number (VIN). You can then filter for device IDs that contain a certain text string. You can combine different criteria to create a complex filter. For example, one criterion could be the manufacturer code. Your second criterion could be the code for the make or model. After you create the smart group, the group would contain only devices that match both your chosen manufacturer and model.",
                    url: "/devices",
                    popoverImage: {
                        src: assets + "v1/" + "02__whats-new-feature__smart-filters.svg",
                    },
                    blogImage: {
                        src: assets + "v1/blog/" + "02__whats-new-feature__smart-filters.svg",
                    },
                },
                step: {
                    id: "smartFilters",
                    order: 3,
                    next: "createUpdate",
                    previous: "smartGroups",
                },
            },
            createUpdate: {
                feature: {
                    title: "Introducing the “Updates” workflow",
                    message: {
                        __html: "<p>You use this workflow to put your update tasks into groups called “Updates”. For example, suppose you want to update some voice control software from version 1 to 2. You also want to update the parking assistance software from version 10 to 11. You can group these two tasks into one Update and call it something like “IVI Updates Sept 2018”.</p>" +
                            "<strong>Key points to remember:</strong>" +
                            "<ul><li>You manage your updates on the new “Updates” view.</li>" +
                            "<li>You no longer configure update tasks during the campaign creation wizard.</li>" +
                            "<li>Instead, when you create a campaign, you select the updates that you created previously.</li></ul>",
                    },
                    url: "/updates",
                    popoverImage: {
                        src: assets + "v1/" + "03__whats-new-feature__create-update.svg",
                    },
                    blogImage: {
                        src: assets + "v1/blog/" + "03__whats-new-feature__create-update.svg",
                    },
                },
                step: {
                    id: "createUpdate",
                    order: 4,
                    next: "selectUpdate",
                    previous: "smartFilters",
                },
            },
            selectUpdate: {
                feature: {
                    title: "Campaign creation includes some new steps",
                    message: "As we described previously, you now configure your update tasks in a separate workflow. When you create a campaign, you select the update that you want to use. For example, suppose that your campaign targets software on the IVI. You would select an update like “IVI Sept 2018” that you created in the “Updates” view.",
                    url: "/campaigns",
                    popoverImage: {
                        src: assets + "v1/" + "04__whats-new-feature__select-update.svg",
                    },
                    blogImage: {
                        src: assets + "v1/blog/" + "04__whats-new-feature__select-update.svg",
                    },
                },
                step: {
                    id: "selectUpdate",
                    order: 5,
                    next: "metadata",
                    previous: "createUpdate",
                }
            },
            metadata: {
                feature: {
                    title: "Introducing the Distribution information",
                    message: "You can now request approval from end users to install the software. By default, OTA Connect installs your software updates “silently”. There is usually no interaction required from the end user. However, you might be required to ask the end user’s permission before you install certain types of updates. For example, if the update makes the vehicle temporarily unusable. In this step, you can now configure an installation prompt and notification for the end user to read.",
                    url: "/campaigns",
                    popoverImage: {
                        src: assets + "v1/" + "05__whats-new-feature__dist-info.svg",
                    },
                    blogImage: {
                        src: assets + "v1/blog/" + "05__whats-new-feature__dist-info.svg",
                    },
                },
                step: {
                    id: "metadata",
                    order: 6,
                    next: undefined,
                    previous: "selectUpdate",
                },
                buttons: ["Back", "Go to summary", "Finish"],
            },
        },
    },
};