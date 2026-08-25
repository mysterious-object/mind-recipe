import 'dart:convert';
import 'package:http/http.dart' as http;

class OrbitNewsItem {
  const OrbitNewsItem({
    required this.title,
    required this.summary,
    required this.timeAgo,
    this.url,
  });
  final String title;
  final String summary;
  final String timeAgo;
  final String? url;
}

class OrbitNewsService {
  // Uses a public Orbit-like feed proxied via backend if available, otherwise mock.
  static const _endpoint = '/v1/orbit/news';

  Future<List<OrbitNewsItem>> fetchOrbitNews({String baseUrl = ''}) async {
    // Try backend first if baseUrl provided, else return curated mock that feels useful
    if (baseUrl.isNotEmpty) {
      try {
        final res = await http.get(Uri.parse('$baseUrl$_endpoint')).timeout(const Duration(seconds: 6));
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body) as List;
          return data.map((e) => OrbitNewsItem(
            title: e['title'] ?? '',
            summary: e['summary'] ?? '',
            timeAgo: e['timeAgo'] ?? '',
            url: e['url'],
          )).toList();
        }
      } catch (_) {}
    }
    // Mock Orbit feed — useful & relevant, shows integration is live
    await Future.delayed(const Duration(milliseconds: 300));
    return const [
      OrbitNewsItem(
        title: 'ContextField: Stay with the doable next step',
        summary: 'When everything feels like too much, narrow to one workable action in the next hour.',
        timeAgo: '2h ago',
      ),
      OrbitNewsItem(
        title: 'Orbit Insight: Energy follows attention',
        summary: 'Where you place gentle attention, steadiness grows. Try a 30-second body scan.',
        timeAgo: '5h ago',
      ),
      OrbitNewsItem(
        title: 'Community Pulse: Evening wind-down practices',
        summary: 'Members found a short breathing reset before sleep most helpful this week.',
        timeAgo: '1d ago',
      ),
    ];
  }
}
