(function ($) {

    "use strict";



    //    const url = 'http://localhost:7777/api/users';
    //    const allUsername = [];
    //    const allUsernamel = ["hi", "hello"];
    //    var inputusername = '';
    //
    //
    //
    //    fetch(url)
    //        .then(res => res.json())
    //        .then(data => {
    //            data.forEach(user => {
    //                allUsername.push(user.username);
    //            });
    //        });

    // collecting value from URL
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.has('username');
    let username = searchParams.get('username');
    $('#hid_user_name').val(username);

    // showing the input username
    var htmlStr = '<i class="text-center logst">Logged in as ' + username + '</i>';
    $('.loggedUser').html(htmlStr);

    // fetch all threads
    const allThreadsUrl = 'http://localhost:7777/api/threads';

    let htmlThreads = '';

    let htmlPosts = '';

    fetch(allThreadsUrl)
        .then(res => res.json())
        .then(data => {
            data.forEach(thread => {
                htmlThreads += `
                <div class="mb-3">
                <a class="" data-bs-toggle="collapse" href="#collapseExample${thread.id}"   role="button" aria-expanded="false" aria-controls="collapseExample">
                                <u>${thread.thread_title} </u>
                    </a>
                    <div class="collapse" id="collapseExample${thread.id}">
                            <div class="card card-body">
                        
                                <div class="posts_main${thread.id}"></div>


                                <form class="replybox">
                                            <div class="mb-3">
                                                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="My Reply">
                                    </div>
                                    <button type="submit" class="btn btn-primary font-rb">Post</button>
                                </form>
                        </div>
                    </div>
                </div>
                `;

                fetch('http://localhost:7777/api/threads/' + thread.id + '/posts')
                    .then(res => res.json())
                    .then(data => {
                        data.forEach(post => {

                            $('.posts_main' + thread.id).append(`<p class="mb-3"> ${post.text} 
                                -<b> ${post.name} </b> </p>`);

                        });
                        //$('.posts_main'+thread.id).html(htmlPosts);
                    });

            });
            $('.threads_main').html(htmlThreads);
        });


    // post threads
    $('#user').val(username);
    const postFormData = document.querySelector('.postForm');
    const postTitle = $('#titlePOST').val();
    const postName = $('#user').val();


    postFormData.addEventListener('submit', (e) => {
        e.preventDefault();
        const postTitle = $('#titlePOST').val();
        const postEmoji = $('#emoji').val();

        fetch('http://localhost:7777/api/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    thread_title: postTitle,
                    user: postName,
                    icon: postEmoji,
                    text: 'ok',
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })

    })


}(jQuery));
