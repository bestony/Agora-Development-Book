// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="intro.html">本书介绍</a></li><li class="chapter-item expanded affix "><a href="about-author.html">关于作者</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">关于 Agora.io</li><li class="chapter-item expanded "><a href="about-price.html"><strong aria-hidden="true">1.</strong> 关于价格</a></li><li class="chapter-item expanded affix "><li class="part-title">Agora 应用开发接入</li><li class="chapter-item expanded "><a href="quick-start-for-rtc.html"><strong aria-hidden="true">2.</strong> 快速在 Web 应用中接入语音通话</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="detect-user-speak.html"><strong aria-hidden="true">2.1.</strong> 实现用户说话监听</a></li><li class="chapter-item expanded "><a href="mute-people.html"><strong aria-hidden="true">2.2.</strong> 实现用户静音</a></li><li class="chapter-item expanded "><a href="error-code.html"><strong aria-hidden="true">2.3.</strong> 查找错误码</a></li></ol></li><li class="chapter-item expanded "><a href="quick-start-for-rtm.html"><strong aria-hidden="true">3.</strong> 快速在 Web 应用中接入实时消息/信令</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="send-msg.html"><strong aria-hidden="true">3.1.</strong> 实现信令传递与解析</a></li><li class="chapter-item expanded "><a href="send-exit.html"><strong aria-hidden="true">3.2.</strong> 实现退出时发送信令</a></li><li class="chapter-item expanded "><a href="get-big-room.html"><strong aria-hidden="true">3.3.</strong> 实现超过 512 人的大型房间</a></li><li class="chapter-item expanded "><a href="get-user-count.html"><strong aria-hidden="true">3.4.</strong> 实现显示用户人数</a></li><li class="chapter-item expanded "><a href="some-points.html"><strong aria-hidden="true">3.5.</strong> 一些需要注意的点</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Agora 应用开发 FAQ</li><li class="chapter-item expanded "><a href="create-application.html"><strong aria-hidden="true">4.</strong> 关于项目</a></li><li class="chapter-item expanded affix "><a href="feedback.html">联系我</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
