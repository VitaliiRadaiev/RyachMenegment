{
    let textScrollBtnAll = document.querySelectorAll('[data-action="scroll-to-next-block"]');
    if(textScrollBtnAll.length) {
        textScrollBtnAll.forEach(textScrollBtn => {
            textScrollBtn.addEventListener('click', () => {
                let parent = textScrollBtn.closest('.text-block');
                window.scrollTo({
                    top: parent.nextElementSibling.offsetTop - 40,
                    behavior: "smooth"
                })
            })
        })
    }
}