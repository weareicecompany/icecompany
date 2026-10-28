/**
 * ALL-IN GROUPBUY - Interactive Group Purchase Platform Script
 * Sticky 2-Column Scrollspy Restored, Role Toggle, and Transparent Demo Modal
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     0. Hero Video Fade-in (prevent flash/poster glitch on refresh)
     - Video starts at opacity:0 (CSS default)
     - canplay fires as soon as enough data is buffered to begin playback
     - is-ready class triggers the CSS opacity 0→1 transition (0.9s ease)
     -------------------------------------------------------------------------- */
  const heroBgVideo = document.querySelector('.hero-bg-video');
  if (heroBgVideo) {
    const revealVideo = () => heroBgVideo.classList.add('is-ready');

    // canplay = video can start playing without buffering interruption
    heroBgVideo.addEventListener('canplay', revealVideo, { once: true });

    // Safety fallback: if video was already loaded (cached), fire immediately
    if (heroBgVideo.readyState >= 3) revealVideo();
  }

  /* --------------------------------------------------------------------------
     1. Header Scroll Effect
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });

  /* --------------------------------------------------------------------------
     2. Mobile Drawer Navigation
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerItems = document.querySelectorAll('.drawer-item');

  const openDrawer = () => {
    mobileDrawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    drawerItems.forEach(item => item.addEventListener('click', closeDrawer));
  }

  /* --------------------------------------------------------------------------
     3. Restored Interactive Sticky 2-Column Section (Scrollspy & Tab Click)
     - Left Column: Sticky Tab Menu (Pinned while scrolling right side)
     - Right Column: Scrollable Detailed Cards
     -------------------------------------------------------------------------- */
  const stickyTabs = document.querySelectorAll('.sticky-tab');
  const solCards = document.querySelectorAll('.sol-card');

  // A. Tab Click -> Smooth scroll to target card
  stickyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      const targetCard = document.getElementById(targetId);

      if (targetCard) {
        stickyTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const headerOffset = 90;
        const targetTop = targetCard.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // B. Scrollspy -> Highlight left tab based on right card position
  const handleScrollspy = () => {
    const scrollPos = window.scrollY + 180;

    solCards.forEach(card => {
      const top = card.offsetTop;
      const height = card.offsetHeight;
      const cardId = card.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        stickyTabs.forEach(t => {
          if (t.getAttribute('data-target') === cardId) {
            t.classList.add('active');
          } else {
            t.classList.remove('active');
          }
        });

        solCards.forEach(c => c.classList.remove('is-active-card'));
        card.classList.add('is-active-card');
      }
    });
  };

  window.addEventListener('scroll', handleScrollspy, { passive: true });

  /* --------------------------------------------------------------------------
     4. Dynamic Hover Spotlight Effect for Core Solution Cards (.pillar-card)
     - Accurately tracks mouse coordinates relative to each individual card
     - Dynamically updates --mouse-x and --mouse-y on the hovered card
     - Radial gradient spotlight follows the exact cursor position on all cards
     -------------------------------------------------------------------------- */
  const pillarCards = document.querySelectorAll('.pillar-card');

  pillarCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      // Move spotlight away when cursor exits the card
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  });

  /* --------------------------------------------------------------------------
     5. Role Selector in Contact Form (Brand vs Influencer)
     -------------------------------------------------------------------------- */
  const roleButtons = document.querySelectorAll('.role-btn');
  const inquiryRoleInput = document.getElementById('inquiryRole');
  const brandLabel = document.getElementById('brandLabel');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');
      if (inquiryRoleInput) inquiryRoleInput.value = role;

      if (brandLabel) {
        brandLabel.innerHTML = role === 'brand' 
          ? '브랜드명 / 제조사명 <span class="req">*</span>'
          : '운영 마켓명 / 인플루언서 닉네임 <span class="req">*</span>';
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Simple Contact Form & Honest Demo Notice Modal
     - Requirement: "문의 양식은 실제 전송 기능이 없으면 없는 상태라고 명확하게 알려줘. 작동하는 것처럼 꾸미지 마."
     -------------------------------------------------------------------------- */
  const simpleForm = document.getElementById('simpleInquiryForm');
  const demoModal = document.getElementById('demoNoticeModal');
  const demoCloseBtn = document.getElementById('demoCloseBtn');
  const demoBackdrop = document.getElementById('demoBackdrop');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalSummary = document.getElementById('modalSummary');

  const openDemoModal = (data) => {
    modalSummary.innerHTML = `
      <p><strong>• 신청 구분:</strong> ${escapeHtml(data.roleText)}</p>
      <p><strong>• 담당자 성함:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>• 연락처:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>• 브랜드/마켓:</strong> ${escapeHtml(data.brand)}</p>
      <p><strong>• 인스타그램:</strong> ${escapeHtml(data.insta)}</p>
      <p><strong>• 이메일 주소:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>• 문의 및 품목:</strong> ${escapeHtml(data.text || '(입력 내용 없음)')}</p>
    `;

    demoModal.classList.add('is-active');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDemoModal = () => {
    demoModal.classList.remove('is-active');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (simpleForm) {
    simpleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const roleVal = inquiryRoleInput ? inquiryRoleInput.value : 'brand';
      const roleText = roleVal === 'brand' ? '제조사 / 브랜드사 공동구매 문의' : '인플루언서 / 셀러 공구 신청';
      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const brand = document.getElementById('brandName').value.trim();
      const insta = document.getElementById('instaAccount').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const text = document.getElementById('inquiryText').value.trim();

      if (!name || !phone || !brand || !insta || !email) {
        showToast('필수 입력 항목(*)을 모두 작성해 주세요.');
        return;
      }

      openDemoModal({
        roleText,
        name,
        phone,
        brand,
        insta,
        email,
        text
      });
    });
  }

  if (demoCloseBtn) demoCloseBtn.addEventListener('click', closeDemoModal);
  if (demoBackdrop) demoBackdrop.addEventListener('click', closeDemoModal);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeDemoModal);

  /* --------------------------------------------------------------------------
     7. Toast Notification & Escape Key
     -------------------------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-active');
    }, 2800);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (demoModal.classList.contains('is-active')) closeDemoModal();
      if (mobileDrawer.classList.contains('is-open')) closeDrawer();
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
