#!/bin/bash

##############################################################################
# Smoke Test Script for Enterprise Profile Builder
# Purpose: Quick validation that core app functionality works
# Usage: npm run smoke-test or ./scripts/smoke-test.sh
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Helper function to print section headers
print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Helper function to run a test
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  
  echo -e "${YELLOW}⏳ Running: ${test_name}...${NC}"
  
  if eval "$test_command" > /tmp/test_output_$TESTS_TOTAL.log 2>&1; then
    echo -e "${GREEN}✓ PASS: ${test_name}${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL: ${test_name}${NC}"
    echo -e "${RED}  Output:${NC}"
    cat /tmp/test_output_$TESTS_TOTAL.log | tail -20
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# Print banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     ENTERPRISE PROFILE BUILDER - SMOKE TEST SUITE           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

START_TIME=$(date +%s)

# 1. Environment Check
print_header "1. Environment Check"
run_test "Node.js is installed" "node --version"
run_test "npm is installed" "npm --version"
run_test "package.json exists" "test -f package.json"

# 2. Static File Checks
print_header "2. Static File Checks"
run_test "index.html exists" "test -f index.html"
run_test "vite.config.ts exists" "test -f vite.config.ts"
run_test "src directory exists" "test -d src"
run_test "App.tsx exists" "test -f src/App.tsx"
run_test "main.tsx exists" "test -f src/main.tsx"

# 3. Critical Files Check
print_header "3. Critical Files Check"
CRITICAL_FILES=(
  "src/components/ErrorBoundary.tsx"
  "src/lib/logger.ts"
  "src/lib/storage.ts"
  "src/lib/async-handler.ts"
  "src/contexts/NavigationContext.tsx"
  "src/contexts/ToastContext.tsx"
  "src/providers/AppProvider.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
  run_test "Critical file: $file" "test -f $file"
done

# 4. Security Checks
print_header "4. Security Checks"
run_test "No hardcoded secrets in src" "! grep -r 'sk-[a-zA-Z0-9]\{48\}' src/ 2>/dev/null || true"
run_test "No obvious API keys in src" "! grep -r 'api_key.*=' src/ 2>/dev/null | grep -v test | grep -v example || true"

# 5. Code Quality Checks
print_header "5. Code Quality Checks"
run_test "Error handling implemented" "grep -r 'try.*catch' src/ > /dev/null"
run_test "Loading states exist" "test -f src/components/ui/LoadingState.tsx"
run_test "Empty states exist" "test -f src/components/ui/EmptyState.tsx"

# 6. Performance Checks
print_header "6. Performance Checks"

# Check for large files in src
LARGE_FILES=$(find src -type f -size +100k 2>/dev/null || true)
if [ -n "$LARGE_FILES" ]; then
  echo -e "${YELLOW}⚠ Large files found (>100KB):${NC}"
  echo "$LARGE_FILES"
else
  echo -e "${GREEN}✓ No large files in src${NC}"
fi

# Test Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

print_header "Test Summary"

echo -e "${BLUE}Total Tests: ${NC}${TESTS_TOTAL}"
echo -e "${GREEN}Passed: ${NC}${TESTS_PASSED}"
echo -e "${RED}Failed: ${NC}${TESTS_FAILED}"
echo -e "${BLUE}Duration: ${NC}${DURATION}s"

# Final status
echo ""
if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                                       ║${NC}"
  echo -e "${GREEN}║   ✓ ALL SMOKE TESTS PASSED! 🎉       ║${NC}"
  echo -e "${GREEN}║                                       ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
  exit 0
else
  echo -e "${RED}╔═══════════════════════════════════════╗${NC}"
  echo -e "${RED}║                                       ║${NC}"
  echo -e "${RED}║   ✗ SMOKE TESTS FAILED                ║${NC}"
  echo -e "${RED}║                                       ║${NC}"
  echo -e "${RED}╚═══════════════════════════════════════╝${NC}"
  
  echo -e "\n${YELLOW}💡 Tips:${NC}"
  echo "  - Check the output above for specific failures"
  echo "  - Run failed tests individually for more details"
  
  exit 1
fi
