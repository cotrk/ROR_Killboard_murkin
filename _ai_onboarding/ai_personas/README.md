# 🤖 AI Personas - Killboard Project

## 🎯 Overview

This directory contains specialized AI personas designed for rapid onboarding and focused expertise in specific domains of the Warhammer Online killboard project. Each persona provides domain-specific knowledge, working directory scope, and clear task definitions.

## 📁 Persona Organization

```
ai_personas/
├── development/                    # 🛠️ Engineering & Development
│   ├── frontend-ui-specialist.md   # 🎨 UI components, DaisyUI, React
│   ├── graphql-architect.md        # 🏗️ GraphQL schema, queries, Apollo
│   ├── routing-engineer.md         # 🛣️ React Router, navigation, code splitting
│   ├── utils-specialist.md         # 🛠️ Utility functions, code organization
│   ├── refactoring-specialist.md    # 🔧 Code refactoring, modernization
│   ├── testing-specialist.md        # 🧪 Test coverage, Vitest, React Testing Library
│   └── react-architecture-typescript.md # 🏗️ React patterns, TypeScript
├── design/                        # 🎨 Design & User Experience
│   ├── ui-ux-accessibility-specialist.md # ♿ UI/UX, accessibility, DaisyUI
│   └── warhammer-domain-expert.md  # 🎮 Warhammer Online game expertise
├── devops/                        # 🚀 Infrastructure & Operations
│   └── performance-optimization.md # ⚡ Performance, Core Web Vitals, bundle analysis
├── content/                       # 📝 Documentation & Content
│   └── documentation-curator.md    # 📚 Project context, AI coordination
├── management/                    # 📋 Project & Team Management
│   └── [future personas]           # 🎯 Project coordination, QA
└── README.md                      # 📖 This documentation
```

## 🎯 Current AI Team

### 🛠️ Development Team (7 personas)

| Persona                             | Domain            | Focus                                        | Working Directory               |
| ----------------------------------- | ----------------- | -------------------------------------------- | ------------------------------- |
| **Frontend UI Specialist**          | React Components  | DaisyUI migration, component architecture    | `src/components/`               |
| **GraphQL Architect**               | Data Layer        | Schema validation, query optimization        | `src/graphql/`                  |
| **Routing Engineer**                | Navigation        | Route architecture, code splitting           | `src/routes/`                   |
| **Utils Specialist**                | Code Organization | Utility functions, module structure          | `src/utils/`                    |
| **Refactoring Specialist**          | Code Quality      | Legacy modernization, technical debt         | `src/` (full access)            |
| **Testing Specialist**              | Quality Assurance | Test coverage, Vitest, React Testing Library | `src/__tests__/`                |
| **React Architecture & TypeScript** | Architecture      | Component patterns, type safety              | `src/components/`, `src/types/` |

### 🎨 Design Team (2 personas)

| Persona                              | Domain          | Focus                              | Working Directory               |
| ------------------------------------ | --------------- | ---------------------------------- | ------------------------------- |
| **UI/UX & Accessibility Specialist** | User Experience | Bulma eradication, WCAG compliance | `src/components/`               |
| **Warhammer Domain Expert**          | Game Knowledge  | Career systems, scenarios, RvR     | `src/components/`, `src/types/` |

### 🚀 DevOps Team (1 persona)

| Persona                      | Domain      | Focus                            | Working Directory                   |
| ---------------------------- | ----------- | -------------------------------- | ----------------------------------- |
| **Performance Optimization** | Performance | Core Web Vitals, bundle analysis | `vite.config.ts`, `src/components/` |

### 📝 Content Team (1 persona)

| Persona                   | Domain               | Focus                            | Working Directory                 |
| ------------------------- | -------------------- | -------------------------------- | --------------------------------- |
| **Documentation Curator** | Knowledge Management | Project context, AI coordination | `@[_ai_onboarding]/context_docs/` |

## 🚀 Usage Guidelines

### 📋 How to Use AI Personas

1. **Select Appropriate Persona** - Choose based on task domain and complexity
2. **Provide Context** - Include current project status and immediate goals
3. **Define Scope** - Clear directory boundaries and responsibility areas
4. **Set Constraints** - Define what should NOT be changed or broken
5. **Establish Metrics** - Clear success criteria and quality gates

### 🔄 Collaboration Patterns

**Multi-AI Workflow:**

- **AI 1 (Lead)** - Full codebase access, architectural decisions
- **AI 2-4 (Specialists)** - Domain-specific expertise, focused tasks
- **Cross-AI Communication** - Shared context, progress updates
- **Conflict Resolution** - Clear escalation paths for disagreements

**Task Assignment Strategy:**

- **UI Tasks** → Frontend UI Specialist
- **Data Layer Tasks** → GraphQL Architect
- **Navigation Tasks** → Routing Engineer
- **Utility Tasks** → Utils Specialist
- **Game-Specific Tasks** → Warhammer Domain Expert
- **Performance Tasks** → Performance Optimization
- **Quality Tasks** → Testing Specialist
- **Architecture Tasks** → React Architecture & TypeScript

### 📊 Success Tracking

**Each persona includes:**

- **Clear role definition** with domain expertise
- **Project context** with current status and issues
- **Immediate tasks** with priority ordering
- **Success metrics** with measurable targets
- **Quality gates** with completion criteria
- **Working directory scope** with clear boundaries

## 🎯 Project Context Access

All AI personas reference centralized context documents:

- **Current Issues:** `@[_ai_onboarding]/context_docs/context_current_issues.md`
- **Project Overview:** `@[_ai_onboarding]/context_docs/context_folder_structure.md`
- **Recent Progress:** `@[_ai_onboarding]/context_docs/context_recent_progress.md`
- **Tech Stack:** `@[_ai_onboarding]/context_docs/context_tech_stack.md`

## 🔄 Development Workflow

### 📋 Onboarding New AI

When bringing in a new AI model:

1. **Review this README** - Understand project context and current status
2. **Select appropriate persona** - Match task to AI specialization
3. **Provide working directory scope** - Clear access boundaries
4. **Share current issues** - Immediate problems to address
5. **Define success criteria** - Measurable completion goals

### 📞 Support and Escalation

**AI Coordination Issues:**

- **Context conflicts** - Overlapping work or contradictory changes
- **Communication gaps** - Misaligned expectations or progress updates
- **Technical disagreements** - Different approaches to the same problem

**📞 Escalation Path:**

1. **Technical lead** - Current AI makes final architectural decisions
2. **Documentation Curator** - Updates centralized context
3. **Project documentation** - Update this README with resolution
4. **Knowledge transfer** - Document decisions for future reference
5. **Persona refinement** - Update AI personas based on learnings

## 🚀 Current Project Status

### ✅ Major Achievements

- **Bulma CSS Eradication** - 95% complete, only remnants remain
- **GraphQL 400 Errors** - All resolved, queries optimized
- **Missing Components** - All created with modern styling
- **Import/Export Issues** - All conflicts resolved
- **Application Functional** - Core features working with real data
- **AI Persona System** - Complete with 11 specialized personas

### 🔄 In Progress

- **Code Cleanup** - Removing redundancy, consolidating patterns
- **Performance Optimization** - Bundle analysis, lazy loading implementation
- **UI Consistency** - Enforcing DaisyUI design system
- **Documentation** - Improving code comments and usage examples

### 📋 Next Phase Goals

- **Complete Bulma eradication** - Remove all remaining Bulma classes
- **Implement advanced caching** - Apollo client optimization
- **Enhance accessibility** - WCAG compliance improvements
- **Add comprehensive testing** - Unit and integration test coverage
- **Performance monitoring** - Real-time metrics and optimization

## 🎯 Framework Benefits

### ✅ Immediate Benefits

- **Instant Context** - New AIs start with full project understanding
- **Focused Expertise** - Each AI has clear domain specialization
- **Reduced Conflicts** - Different AIs work in separate directories
- **Parallel Processing** - Multiple tasks completed simultaneously
- **Scalable System** - Easy to add more specialized AIs

### 🚀 Long-term Benefits

- **Knowledge Preservation** - Project decisions and evolution documented
- **Team Coordination** - Consistent information across all AI work
- **Quality Assurance** - Standardized approaches and patterns
- **Future-Ready** - Framework supports evolving needs and new technologies

## 📝 Maintenance

### 🔄 Regular Updates

**Monthly:**

- Review all AI personas for accuracy and relevance
- Update context documents with latest project status
- Add new personas as project needs evolve
- Remove or update outdated personas

**As Needed:**

- Update persona working directories when project structure changes
- Modify success metrics based on evolving project goals
- Add new domain expertise areas as project grows
- Refine collaboration patterns based on team experience

### 📊 Quality Assurance

- **Consistency Check** - Ensure all personas reference correct context documents
- **Link Validation** - Verify all internal links and references work
- **Content Review** - Regular review for accuracy and completeness
- **Usage Analysis** - Track which personas are most valuable

---

## 🎉 AI Persona System Status: **ACTIVE & COMPLETE**

**Current Version:** 1.0  
**Total Personas:** 11 specialized AI experts  
**Coverage:** Complete development lifecycle from architecture to deployment  
**Status:** Enterprise-ready AI development team

**This AI Persona Framework enables rapid AI onboarding while maintaining code quality and project consistency.**
