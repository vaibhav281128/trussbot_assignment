
exports.validateForm = (fields, files, callback) => {

    var results = {
        success : true,
        message : []
    };

    if(!fields.name || fields.name.length < 4)
    {
        results.success = false;
        results.message.push('Invalid Name.');
    }

    if(!fields.phone)
    {
        results.success = false;
        results.message.push('Invalid Phone Number.');
    }

    if(!fields.email)
    {
        results.success = false;
        results.message.push('Invalid Email ID.');
    }

    if(!fields.jobTitle)
    {
        results.success = false;
        results.message.push('Invalid Job Title.');
    }

    /*if(!files.resume.name)
    {
        results.success = false;
        message.push('Resume not attached.');
    }*/
        
    callback(results);
}