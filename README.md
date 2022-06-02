# CMDD Framework Sample
## _The integrated perspective editor_
[![Go|JavaScript](https://discoversdkcdn.azureedge.net/runtimecontent/companyfiles/5547/1711/thumbnail.png?v130981051425387404)](https://nodesource.com/products/nsolid)
Instructions for running and testing the proposed framework implementation. We will cover:
- Installation requirements and run instructions
- Suggested test-script

## Installation requirements and instructions
This editor was built using only html, css and javascript running in a standard browser. However, as some libraries are third-party, you will need to use a local server to run this example. In this tutorial we recommend using [node.js](https://nodejs.org/en/) to provide the Node Package Manager Tool (npm). Instruction for installing on your Operating System are available on the nodejs official site. 

After install, you just need to install a simple webserver package on your machine. We suggest the following one:

```sh
npm install -g live-server
```
After that, you just need to download the files from the repository in a specific folder on your computer.

> **Observation**: Due to limitations of anonymous.4open.science platform
>it is not possible to clone directly using git command. You will need to 
>manually download the files. To make it easier, we created the project's 
>.zip file that can be downloaded directly from the anonymous repository.

Now you can use the terminal to run the web server from the project folder on your computer:
```sh
cd <project-folder-dir>
live-server .
```
The live-server will ask to automatically open the project homepage. You can test as you want, or you can follow the following test-script.
## Suggested test-script

After runnig the project, a index page will automacally be loaded. This contains a simple initial concept map that can be edited as you like. But, lets load the article sample by click in the **Load Article Samples** button on the right panel. The working area will display the _shared understanding model_.
### Consulting abstract concepts
Look at the map shown. You can consult the abstract concepts of each concept present in the shared model just by selecting the desired concept. 

The abstract concepts will be checked in the *Know Abstracts Concepts* div on the right panel. Pay special attention to the *Concept Map Editor* node. It is marked as a _Task_ instance in the _KanBan Perspective_ (last in the list) and has an _is in_ relationship with the *Done* node, which in turn is marked as an instance of the abstract concept _Development Stage_ in the _Kanban Perspective_. 
### Changing view perspective
Now, let's look at this same model using a different visual perspective. Click on the *Go to KanBan Perspective* button.
In this version it is possible to change the development stage. Let's return the *Concept Map Editor* node to the *Testing* stage. Click and drag the task to the corresponding column.
### Checking changes propagation
Return to the concept map by clicking on *Map Perspective* and notice the change in the _is in_ relationship that starts from the changed node in the KanBan editor.

#### Under Development

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
