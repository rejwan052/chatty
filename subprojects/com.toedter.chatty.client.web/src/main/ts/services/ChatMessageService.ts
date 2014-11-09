/**
 * Copyright (c) 2014 Kai Toedter
 * All rights reserved.
 * Licensed under MIT License, see http://toedter.mit-license.org/
 */

/// <reference path="../chatty.ts" />
/// <reference path="../model/ChatMessage.ts" />
/// <reference path="../model/User.ts" />

module chatty {
    export class ChatMessageService {
        static $inject = ['chatty.apiResource', '$resource'];

        constructor(private apiResource:ng.resource.IResourceClass<ng.resource.IResource<any>>,
                    private $resource:ng.resource.IResourceService) {
            console.log('ChatMessage service started')
        }

        getAllChatMessages(callback:(messages:chatty.model.ChatMessageResource[]) => void) {
            this.apiResource.get((api:any) => {
                var chatMessagesResource:chatty.model.ChatMessagesResource = this.getMessagesResource(api);
                if (chatMessagesResource) {
                    chatMessagesResource.get((result:any) => {
                        var messages:chatty.model.ChatMessageResource[] = [];
                        if (result.hasOwnProperty("_embedded") && result._embedded.hasOwnProperty("messages")) {
                            messages = result._embedded.messages;
                        }
                        callback(messages);
                    });
                }
            });
        }

        postMessage(user:chatty.model.User, message:string):void {
            this.apiResource.get((api:any) => {
                var chatMessagesResource:chatty.model.ChatMessagesResource = this.getMessagesResource(api);
                if (chatMessagesResource) {
                     chatMessagesResource.save({author: user, text: message}, (result:any) => {
                        console.log(result);
                    }, (result:any) => {
                        console.log(result);
                    });
                }
            });
        }

        private getMessagesResource(apiResource:any):chatty.model.ChatMessagesResource {
            if (apiResource.hasOwnProperty("_links") && apiResource._links.hasOwnProperty("chatty:messages")) {
                var href:string = apiResource._links['chatty:messages'].href;
                // remove template parameters
                href = href.replace(/{.*}/g, '');
                var chatMessagesResource:chatty.model.ChatMessagesResource =
                    <chatty.model.ChatMessagesResource> this.$resource(href + '/:id', {id: '@id'});
                return chatMessagesResource;
            }
        }
    }
}

chatty.services.service('chatty.chatMessageService', chatty.ChatMessageService);