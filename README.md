# Root NPM project

This is a rudimentary example of a Nodejs integration with Typescript using `ts-node`,`TypeScript`, `lodash`, and other technologies.

Below are the commands run to generate the project (be sure `ts-node` is installed globally, if not execute `npm i -g ts-node` before compiling): 

```
    > mkdir <project> && cd <project>
    > npm init <follow prompts>
    > npm i -s express
    > npm i -s ts-node 
    > npm i -s fs
    > npm i -s typescript
    > npm i -s lodash 
    > npm i -s nodemon
    > npm i --save-dev @types/express
    > npm i --save-dev @types/node
    > npm i --save-dev @types/lodash

    > npm ci
```

Once I had the relevant packages installed and configured, I went to the package.json and added the start script (referencing as-yet-to-be-created typescript file) into the scripts portion of the JSON Object as follows: `"start": "npm ci && nodemon ./src/index.ts"`

Then I created the index.ts (commented out will be the pure HTTP listener, but I prefer the express route.)