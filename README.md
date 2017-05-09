# fadmin
Firebase ADMIN SDK CLI wrapper based in NodeJS

I created fadmin in order to manage and authenticate firebase auth based users from a PHP context. 

# Build & install

```npm install -g```

After running install fadmin command should be available in your system.

# Use
```fadmin <sub command> <options>```

common required option:     -c, --config <file>    Configuration file


## Subcommands
* add (adds a new user)
    * -c, --config <file>    Configuration file
    * -e, --email <email>    User email address
    * -p, --password <pass>  User password
    * -d, --display [name]   User display name
    * -u, --uid [uid_value]  Use id as uid value instead of a internal one
* update (update user)
     * -c, --config <file>    Configuration file
     * -e, --email [email]    User email address
     * -p, --password [pass]  User password
     * -d, --display [name]   User display name
     * -u, --uid <uid_value>  User id for lookup
* remove (deletes a user)
     * -c, --config <file>    Configuration file
     * -u, --uid <uid_value>  User id for lookup
* verify (Verify a given token)
     * -c, --config <file>    Configuration file
     * -t, --token <token>    User token from client
     
# Notes
Command output are json formatted to ease parsing on the PHP side.
An example of configuration file is provided inside /conf
