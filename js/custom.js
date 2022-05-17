(function ($) {

    "use strict";


    // collecting value from URL
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.has('username');
    let username = searchParams.get('username');
    $('#hid_user_name').val(username);


    // collection more infos of log user
    fetch('http://localhost:7777/api/users/' + username)
        .then(res => res.json())
        .then(data => {
            $('#userFullNam').val(data.name);

        });

    // showing the input username
    var htmlStr = '<i class="text-center logst">Logged in as ' + username + '</i>';
    $('.loggedUser').html(htmlStr);

    // fetch all threads
    const allThreadsUrl = 'http://localhost:7777/api/threads';

    let htmlThreads = '';
    let htmlPosts = '';

    const userFullName = $('#userFullNam').val();


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


                                <div class="replybox${thread.id}">
                                            <div class="mb-3">
                                                <input type="text" class="form-control replyPOST${thread.id}" placeholder="My Reply">
                                    </div>
                                    <input type="hidden" class="form-control threadID${thread.id}" value="${thread.id}">
                                    <input type="hidden" class="form-control replyUser${thread.id}"  value="${username}">
                                    <input type="hidden" class="form-control replyUserFull${thread.id}" value="${userFullName}">
                                    <a class="btn btn-primary font-rb stopLoad${thread.id}" id="stopLoad${thread.id}" dataID="${thread.id}" onclick="myThreadId(${thread.id})">Post</a>
                                    <a class="btn btn-danger" id="delbtn" onclick="myThreadIdDel(${thread.id})">Delete</a> 
                                </div>
                        </div>
                    </div>
                </div>
                `;

                window.myGlobleFun = function autoLoad() {
                    fetch('http://localhost:7777/api/threads/' + thread.id + '/posts')
                        .then(res => res.json())
                        .then(data => {
                            data.forEach(post => {
                                $('.posts_main' + thread.id).append(`<p class="mb-3"> ${post.text} 
                                -<b> ${post.name} </b> </p>`);

                            });
                        });
                }.call(this);

            });
            $('.threads_main').html(htmlThreads);

        });


    setInterval(window.myGlobleFun, 3000);

    // post threads
    $('#user').val(username);
    const postFormData = document.querySelector('.postForm');
    const postTitle = $('#titlePOST').val();
    const postName = $('#user').val();


    postFormData.addEventListener('submit', (e) => {
        e.preventDefault();
        const postTitle = $('#titlePOST').val();
        const postEmoji = $('#emoji').val();
        const postText = $('#PROtext').val();

        fetch('http://localhost:7777/api/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    thread_title: postTitle,
                    user: postName,
                    icon: postEmoji,
                    text: postText,
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                location.reload();
                return false;
            })
    });

}(jQuery));

function myThreadId(id) {
    const replyText = $('.replyPOST' + id).val();
    const getThreadID = $('.threadID' + id).val();
    const getReplyUser = $('.replyUser' + id).val();
    const getReplyUserFullName = $('.replyUserFull' + id).val();

    fetch('http://localhost:7777/api/threads/' + id + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: replyText,
                user: getReplyUser,
                name: getReplyUserFullName,
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
}

//delete
function myThreadIdDel(id) {

    const checkUser = $('.replyUser' + id).val();
    
    fetch('http://localhost:7777/api/threads/' + id)
        .then(res => res.json())
        .then(data => {

            if (id == data.id && checkUser == data.user) {
                fetch('http://localhost:7777/api/threads/' + id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user: checkUser,
                            id: id,
                        })
                    })
                    .then(res => res.text())
                    .then(data => {
                        location.reload();
                        return false;
                    })



            } else {
                alert("User has no permission...");
            }

        });
}
