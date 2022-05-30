# Instruction for Reviewers

This is a test script for the CMDD Framework.

## Running Instructions
### Requirements
1) [node](https://nodejs.org/en/download/) : Just for running a simple-server locally.
### Packages
You need a simple web server to test the tool, so after installing the node, download the following package from npm using your preferred terminal:

```bash
npm install -g live-server
```

### Cloning Repository
Due to limitations of anonymous.4open.science platform it is not possible to clone directly using git command. You will need to manually download the files. To make it easier, I created the project's [.zip file](https://anonymous.4open.science/r/CMDD-Framework/CMDD.zip) that can be downloaded directly from the anonymous repository.

### Running the Project
After downloading and unzipping the files in a specific directory, using the terminal navigate to the created directory. In the terminal, type:
```bash
live-server .
```

# Suggested Test-Script

After runnig the above command, a index page will automacally be loaded. This contains a simple inition concept map that can be edited as you like. But, lets load the article sample.

### 1) Load Samples
In the operations menu, click on the option *load article samples*.

### 2) Viewing instantiated abstract concepts

Look at the map shown. You can consult the abstract concepts of each concept present in the shared model just by clicking on the concept. The abstract concepts will be marked in "Know Abstracts Concepts."

Click on the *KanBan Editor* concept and note that it has been annotated as a *Task* in both the *Project Manager* and *KanBan* perspectives. Also, note a relationship indicating that the concept is *In Progress*, which is an instance of *Development Stage* in *KanBan Perspective*.

### 3)



## License
[MIT](https://choosealicense.com/licenses/mit/)