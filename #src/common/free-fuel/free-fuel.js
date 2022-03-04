{
    let freeFuelBlock = document.querySelector('[data-free-fuel]');
    if(freeFuelBlock) {
        const getActionItems = () => {
            let arr = [];
            let navItems = freeFuelBlock.querySelectorAll('.free-fuel__nav-item');
            
            if(navItems.length) {
                navItems.forEach(navItem => {
                    arr.push({
                        navItem,
                        marker:  freeFuelBlock.querySelector(`.free-fuel__marker[data-id="${navItem.dataset.id}"]`)
                    })
                })
            }

            return arr;
        }

        let actionItems = getActionItems();

        if(actionItems.length) {
            actionItems.forEach(({navItem, marker}) => {
                navItem.addEventListener('mouseenter', () => {
                    marker.classList.add('active');
                })
                navItem.addEventListener('mouseleave', () => {
                    marker.classList.remove('active');
                })
            })
        }
    }
}